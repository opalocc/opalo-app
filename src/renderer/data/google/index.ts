import { gapi } from 'gapi-script';

const API_KEY = import.meta.env.VITE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/drive';

export const initializeClient = async (callback: any) => {
  const initClient = async () => {
    await gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPES,
    });
    gapi.client.load('drive', 'v3', callback);
  };
  gapi.load('client:auth2', initClient);
};
export const listAllFiles = async (selectedDrive?: string): Promise<any[]> => {
  let files: any[] = [];
  let nextPageToken: string | undefined = '';

  while (nextPageToken !== undefined && nextPageToken !== null) {
    const resp = await gapi.client.drive.files.list({
      pageSize: 1000,
      driveId: selectedDrive,
      corpora: selectedDrive ? 'drive' : 'user',
      includeItemsFromAllDrives: selectedDrive ? true : false,
      supportsAllDrives: selectedDrive ? true : false,
      q: "trashed = false and (mimeType = 'text/markdown' or mimeType = 'application/vnd.google-apps.folder')",
      orderBy: 'folder',
      fields: 'nextPageToken, files(id, name, mimeType, parents)',
      pageToken: nextPageToken,
    });

    if (resp.result.files) {
      files = files.concat(resp.result.files);
    }

    if (!resp.result.nextPageToken) {
      break;
    }

    nextPageToken = resp.result.nextPageToken;
  }
  return files;
};

export const listDrives = async () => {
  const accessToken = gapi.auth.getToken()?.access_token;
  if (!accessToken) {
    alert('No access Token Found.');
    return;
  }
  try {
    const response = await gapi.client.drive.drives.list({
      pageSize: 100,
      fields: 'nextPageToken, drives(id, name)',
    });
    return [{ name: 'My Drive', id: null }, ...response.result.drives];
  } catch (error) {
    console.error(error);
  }
};

export const searchTextInFiles = async (text: string, selectedDrive?: string): Promise<any[]> => {
  const resp = await gapi.client.drive.files.list({
    pageSize: 10,
    driveId: selectedDrive,
    corpora: selectedDrive ? 'drive' : 'user',
    includeItemsFromAllDrives: selectedDrive ? true : false,
    supportsAllDrives: selectedDrive ? true : false,
    q: `trashed = false and mimeType = 'text/markdown' and (fullText contains "${text}" or name contains "${text}")`,
    fields: 'files(id, name, mimeType)',
  });
  return resp.result.files;
};

export const addFolder = async (file: any, selectedDrive?: string): Promise<void> => {
  await gapi.client.drive.files.create({
    resource: {
      parents: [file.id],
      driveId: selectedDrive,
      name: 'new Folder',
      mimeType: 'application/vnd.google-apps.folder',
    },
    supportsAllDrives: selectedDrive ? true : false,
  });
};

export const addFile = async (file: any, selectedDrive?: string): Promise<void> => {
  await gapi.client.drive.files.create({
    resource: {
      parents: [file.id],
      name: 'new File.md',
      mimeType: 'text/markdown',
    },
    supportsAllDrives: selectedDrive ? true : false,
  });
};

export const remove = async (file: any, selectedDrive?: string): Promise<void> => {
  await gapi.client.drive.files.update({
    fileId: file.id,
    supportsAllDrives: selectedDrive ? true : false,
    trashed: true,
  });
};

export const rename = async (file: any, selectedDrive?: string): Promise<void> => {
  await gapi.client.drive.files.update({
    fileId: file.id,
    supportsAllDrives: selectedDrive ? true : false,
    name: file.name,
  });
};

export const isSignedIn = async (): Promise<boolean> => {
  const authInstance = gapi.auth2?.getAuthInstance();
  if (!gapi || !authInstance) return;
  return authInstance.isSignedIn.get();
};

export const getFile = async (fileId: string): Promise<any> => {
  const response = await gapi.client.drive.files.get({
    fileId,
    alt: 'media',
  });
  return response;
};

export const saveFile = async (fileId: string, body: string): Promise<void> => {
  await gapi.client.request({
    path: `/upload/drive/v3/files/${fileId}`,
    method: 'PATCH',
    params: {
      uploadType: 'media',
      supportsAllDrives: true,
    },
    headers: {
      'Content-Type': 'text/markdown',
    },
    body,
  });
};
