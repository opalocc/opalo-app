import React, { useState } from "react";
import { gapi } from "gapi-script";
import { Button, colors } from "@mui/material";
interface FileItem {
  id: string;
  name: string;
  mimeType: string;
}

export const Drive: React.FC = ({onSelect}: any) => {
  const [files, setFiles] = useState<FileItem[]>([]);

  const listFiles = async () => {
    const accessToken = gapi.auth.getToken()?.access_token;

    if (!accessToken) {
      alert("No access Token Found.");
      return;
    }

    try {
      const response = await gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name, mimeType)",
      });
      setFiles(response.result.files);
    } catch (error) {
      console.error(error);
    }
  };
  const getFile = async (id: string, mimeType: string) => {
    const response = await gapi.client.drive.files.get({
        'fileId': id,
        alt:"media"
      });
      onSelect(response.body)
  }

  return (
        <>
          <Button onClick={listFiles} className="mt-4">
            Atualizar Lista
          </Button>
          <div className="mt-6">
            <h3 className="mb-4 text-xl font-semibold">Your Files</h3>
            <ul className="mt-4">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between p-2 border-b"
                >
                  <span>{file.name}</span><Button onClick={() => getFile(file.id, file.mimeType)}>Get</Button>
                </li>
              ))}
            </ul>
          </div>
        </>
  );
};
