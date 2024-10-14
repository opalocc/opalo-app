
import React, { useEffect, useState } from 'react';
import { GapiContext } from '../../contexts/gapi';
import { gapi as googleapi} from "gapi-script";

const API_KEY = import.meta.env.VITE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/drive";

type GapiContextType = {
  gapi: any
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
      gapi
    }
    return (
      <GapiContext.Provider value={GapiContextData}>
        {children}
      </GapiContext.Provider>
    )
  }