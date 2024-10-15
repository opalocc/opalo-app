import { useGapi } from "@/renderer/hooks/gapi";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "@blocknote/shadcn/style.css";
import { Button } from "../ui/button";
 
export const Editor = ({}: any) => {

    const editor: any = useCreateBlockNote();
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
        const response = await gapi.client.request({
            path: `/upload/drive/v3/files/${id}`,
            method: 'PATCH',
            params: {
              uploadType: 'media'
            },
            body: markdownFromBlocks
          })
    }
  return  <>
    <BlockNoteView editor={editor} theme="light" />;
    <div className="ml-auto mt-auto p-4 flex items-center gap-2">
        <Button onClick={() => save()}>Save</Button>
    </div>
  </>
}