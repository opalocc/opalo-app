import React, { useState } from "react";
import { gapi } from "gapi-script";
import { Button } from "@mui/material";
interface FileItem {
  id: string;
  name: string;
}

export const Drive: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);

  const listFiles = async () => {
    const accessToken = gapi.auth.getToken()?.access_token;

    if (!accessToken) {
      alert("No access Token Found.");
      return;
    }

    try {
      const response = await fetch(
        "https://www.googleapis.com/drive/v3/files?pageSize=10&fields=nextPageToken,files(id,name)",
        {
          method: "GET",
          headers: new Headers({
            Authorization: "Bearer " + accessToken,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Error on request: " + response.statusText);
      }

      const data = await response.json();
      console.log("Files:", data.files);
      setFiles(data.files);
    } catch (error) {
      console.error(error);
    }
  };

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
                  <span>{file.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
  );
};
