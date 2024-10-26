
import React, { useEffect, useState } from 'react';
import { GapiContext } from '../../contexts/gapi';
import { gapi as googleapi} from "gapi-script";
import { addFile, addFolder, listAllFiles, listDrives, remove, rename, searchTextInFiles } from '@/renderer/data/google';

const API_KEY = import.meta.env.VITE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/drive";

type GapiContextType = {
  gapi: any,
  listAll: (rootFolder?: string) => Promise<any[]>,
  listFolders: () => Promise<any[]>,
  search: (text:string, rootFolder?: string) => Promise<any[]>,
  add: {
    folder: (file:string, parentFolder?: string) => Promise<void>,
    file: (file:string, parentFolder?: string) => Promise<void>,

  },
  remove: (file:string, parentFolder?: string) => Promise<void>,
  rename: (file:string, parentFolder?: string) => Promise<void>,
}

export function GapiProvider({children}: any) {
    const [gapi, setGapi] = useState(false);
    useEffect(() => {
      const initClient = async() => {
        await googleapi.client 
          .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
          })
          googleapi.client.load('drive', 'v3', () => setGapi(googleapi));
      };    
      googleapi.load("client:auth2", initClient);
    }, []);
  
    const GapiContextData: GapiContextType = {
      gapi,
      listAll: (rootFolder?: string) => listAllFiles(gapi, rootFolder),
      listFolders: () => listDrives(gapi),
      search: (text:string, rootFolder?: string) => searchTextInFiles(gapi, text, rootFolder),
      add: {
        file: (file:any, parentFolder?: string) => addFile(gapi, file,parentFolder),
        folder: (file:any, parentFolder?: string) => addFolder(gapi, file,parentFolder),
      },
      remove: (file:string, parentFolder?: string) => remove(gapi, file, parentFolder),
      rename:  (file:string, parentFolder?: string) => rename(gapi, file, parentFolder)
    }
    return (
      <GapiContext.Provider value={GapiContextData}>
        {children}
      </GapiContext.Provider>
    )
  }