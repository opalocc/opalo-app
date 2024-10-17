import { useGapi } from "@/renderer/hooks/gapi";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/shadcn";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "@blocknote/shadcn/style.css";
import { Button } from "../ui/button";
import {
    BlockNoteSchema,
    defaultBlockSpecs,
    filterSuggestionItems,
  } from "@blocknote/core";
  import {
    SuggestionMenuController,
    getDefaultReactSlashMenuItems,
    useCreateBlockNote,
  } from "@blocknote/react";

    const schema = BlockNoteSchema.create({
        blockSpecs: {
            ...defaultBlockSpecs,
        },
    });

export const Editor = ({}: any) => {

    const editor = useCreateBlockNote({
        schema,
      });
    const { id }: any = useParams()
    const { gapi }: any = useGapi()

    useEffect(() => {
        (async () =>{
            if(!gapi || !id)
                return
            const response = await gapi.client.drive.files.get({
                'fileId': id,
                alt:"media"
            });
            const blocks = await editor.tryParseMarkdownToBlocks(response.body);
            editor.replaceBlocks(editor.document, blocks);
        })()
    },[id, editor])


    const save = async() =>{
        const markdownFromBlocks = await editor.blocksToMarkdownLossy(editor.document);

        await gapi.client.request({
            path: `/upload/drive/v3/files/${id}`,
            method: 'PATCH',
            params: {
                uploadType: "media",
                supportsAllDrives: true,
            },headers: {
            'Content-Type': 'text/markdown'
            },
            body: markdownFromBlocks
          })

    }
  return  <>
    
    <BlockNoteView editor={editor} slashMenu={false} theme="light">
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query: any) =>
            filterSuggestionItems(
              [...getDefaultReactSlashMenuItems(editor)],
              query
            )
          }
        />
      </BlockNoteView>
    <div className="ml-auto mt-auto p-4 flex items-center gap-2">
        <Button onClick={() => save()}>Save</Button>
    </div>
  </>
}
