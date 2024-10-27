
import React, { useEffect, useState } from 'react';
import { GapiContext } from '../../contexts/gapi';
import { gapi } from "gapi-script";
import { addFile, addFolder, getFile, isSignedIn, listAllFiles, listDrives, remove, rename, saveFile, searchTextInFiles } from '@/renderer/data/google';

const API_KEY = import.meta.env.VITE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/drive";

export type GapiContextType = {
  loaded: boolean,
  listAll: (rootFolder?: string) => Promise<any[]>,
  listFolders: () => Promise<any[]>,
  search: (text:string, rootFolder?: string) => Promise<any[]>,
  add: {
    folder: (file:string, parentFolder?: string) => Promise<void>,
    file: (file:string, parentFolder?: string) => Promise<void>,
  },
  get: (id:string) => Promise<any>,
  update: (id:string, body: string) => Promise<void>,
  remove: (file:string, parentFolder?: string) => Promise<void>,
  rename: (file:string, parentFolder?: string) => Promise<void>,
  isSignedIn: () => Promise<boolean>,
}

export function GapiProvider({children}: any) {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
      const initClient = async() => {
        await gapi.client 
          .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
          })
          gapi.client.load('drive', 'v3', () => setLoaded(true));
      };    
      gapi.load("client:auth2", initClient);
    }, []);
  
    const GapiContextData: GapiContextType = {
      loaded,
      listAll: (rootFolder?: string) => listAllFiles(gapi, rootFolder),
      listFolders: () => listDrives(gapi),
      search: (text:string, rootFolder?: string) => searchTextInFiles(gapi, text, rootFolder),
      add: {
        file: (file:any, parentFolder?: string) => addFile(gapi, file, parentFolder),
        folder: (file:any, parentFolder?: string) => addFolder(gapi, file, parentFolder),
      },
      get: (id:string) => getFile(gapi, id),
      update: (id:string, body: string) => saveFile(gapi,id,body),
      remove: (file:string, parentFolder?: string) => remove(gapi, file, parentFolder),
      rename:  (file:string, parentFolder?: string) => rename(gapi, file, parentFolder),
      isSignedIn: () => isSignedIn(gapi)
    }
    return (
      <GapiContext.Provider value={GapiContextData}>
        {children}
      </GapiContext.Provider>
    )
  }