import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { Button, Input } from "@mui/material";
interface FileItem {
  id: string;
  name: string;
}

const API_KEY = import.meta.env.VITE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/drive.file";

const DriveUploadDownload: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsSignedIn);
        });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileMetadata = {
        name: file.name,
      };
      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(fileMetadata)], { type: "application/json" }),
      );
      form.append("file", file);

      const accessToken = gapi.auth.getToken()?.access_token;

      if (!accessToken) {
        alert("Usuário não autenticado");
        return;
      }

      fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
        {
          method: "POST",
          headers: new Headers({ Authorization: "Bearer " + accessToken }),
          body: form,
        },
      )
        .then((res) => res.json())
        .then((val) => {
          console.log("Arquivo enviado, ID:", val.id);
          alert("Upload concluído!");
          listFiles(); // Atualiza a lista de arquivos
        })
        .catch((err) => console.error("Erro no upload:", err));
    }
  };

  const handleFileDownload = (fileId: string, fileName: string) => {
    const accessToken = gapi.auth.getToken()?.access_token;

    if (!accessToken) {
      alert("Usuário não autenticado");
      return;
    }

    fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      method: "GET",
      headers: new Headers({ Authorization: "Bearer " + accessToken }),
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
      })
      .catch((err) => console.error("Erro no download:", err));
  };

  const listFiles = async () => {
    if (!isSignedIn) {
      console.error("Usuário não autenticado.");
      return;
    }

    const accessToken = gapi.auth.getToken()?.access_token;

    if (!accessToken) {
      alert("Token de acesso não encontrado.");
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
        throw new Error("Erro na requisição: " + response.statusText);
      }

      const data = await response.json();
      console.log("Arquivos:", data.files);
      setFiles(data.files);
    } catch (error) {
      console.error("Erro ao listar arquivos:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="mb-6 text-2xl font-bold">Google Drive</h2>
        {isSignedIn ? (
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        ) : (
          <Button onClick={handleLogin}>Login com Google</Button>
        )}
      </div>
      {isSignedIn ? (
        <>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Upload de Arquivo
            </label>
            <Input type="file" onChange={handleFileUpload} />
          </div>
          <Button onClick={listFiles} className="mt-4">
            Atualizar Lista
          </Button>
          <div className="mt-6">
            <h3 className="mb-4 text-xl font-semibold">Seus Arquivos</h3>
            <ul className="mt-4">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between p-2 border-b"
                >
                  <span>{file.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileDownload(file.id, file.name)}
                  >
                    Baixar
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>Por favor, faça login para continuar.</p>
      )}
    </div>
  );
};

export default DriveUploadDownload;