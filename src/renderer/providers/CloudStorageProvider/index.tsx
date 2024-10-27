
import React, { useEffect, useState, createContext, useContext } from 'react';
import { addFile, addFolder, getFile, initializeClient, isSignedIn, listAllFiles, listDrives, remove, rename, saveFile, searchTextInFiles } from '@/renderer/data/google';

export const CloudStorageContext = createContext({});

export const useCloudStorage = () => useContext(CloudStorageContext)

export type CloudStorageContextType = {
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

export const CloudStorageProvider = ({children}: any) => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
      initializeClient(() => setLoaded(true))
    }, []);
  
    const CloudStorageContextData: CloudStorageContextType = {
      loaded,
      listAll: (rootFolder?: string) => listAllFiles(rootFolder),
      listFolders: () => listDrives(),
      search: (text:string, rootFolder?: string) => searchTextInFiles(text, rootFolder),
      add: {
        file: (file:any, parentFolder?: string) => addFile(file, parentFolder),
        folder: (file:any, parentFolder?: string) => addFolder(file, parentFolder),
      },
      get: (id:string) => getFile(id),
      update: (id:string, body: string) => saveFile(id, body),
      remove: (file:string, parentFolder?: string) => remove(file, parentFolder),
      rename:  (file:string, parentFolder?: string) => rename(file, parentFolder),
      isSignedIn: () => isSignedIn()
    }
    return (
      <CloudStorageContext.Provider value={CloudStorageContextData}>
        {children}
      </CloudStorageContext.Provider>
    )
  }