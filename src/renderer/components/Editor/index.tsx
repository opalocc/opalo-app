import { useCloudStorage } from '@/renderer/providers/CloudStorageProvider';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/shadcn'; // eslint-disable-line import/namespace
import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import '@blocknote/shadcn/style.css';
import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs, filterSuggestionItems } from '@blocknote/core';
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from '@blocknote/react';
import { useTheme } from '@/renderer/providers/ThemeProvider';
import { EditorLink } from '../EditorLink';

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    internalLink: EditorLink,
  },
});

const getMentionMenuItems = (
  editor: typeof schema.BlockNoteEditor,
  referencesList: any[]
): DefaultReactSuggestionItem[] => {
  return referencesList.map((link) => ({
    title: link.name,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: 'internalLink',
          props: {
            ...link,
          },
        },
        ' ',
      ]);
    },
  }));
};

export const Editor = () => {
  const { referencesList }: any = useOutletContext();
  const { theme }: any = useTheme();
  const { id }: any = useParams();
  const { loaded, get, update }: any = useCloudStorage();
  const [editableFile, setEditableFile]: any = useState(false);
  const editor = useCreateBlockNote({
    schema,
  });

  useEffect(() => {
    (async () => {
      if (!loaded || !id) return;
      try {
        const response = await get(id);
        const blocks = await editor.tryParseMarkdownToBlocks(response.body);
        editor.replaceBlocks(editor.document, blocks);
        setEditableFile(true);
      } catch {
        setEditableFile(false);
      }
    })();
  }, [id, editor]);

  useEffect(() => {
    return () => {
      save();
    };
  });

  const save = async () => {
    const markdownFromBlocks = await editor.blocksToMarkdownLossy(editor.document);
    await update(id, markdownFromBlocks);
  };

  return editableFile ? (
    <>
      <BlockNoteView editor={editor} slashMenu={false} theme={theme}>
        <SuggestionMenuController
          triggerCharacter={'/'}
          getItems={async (query: any) => filterSuggestionItems([...getDefaultReactSlashMenuItems(editor)], query)}
        />
        <SuggestionMenuController
          triggerCharacter={'@'}
          getItems={async (query) =>
            // Gets the mentions menu items
            filterSuggestionItems(getMentionMenuItems(editor, referencesList), query)
          }
        />
      </BlockNoteView>
    </>
  ) : (
    <>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">Folder</h3>
          <p className="text-sm text-muted-foreground">Nothing to see here 😉</p>
        </div>
      </div>
    </>
  );
};
