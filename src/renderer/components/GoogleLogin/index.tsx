import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { Button } from "@/renderer/components/ui/button"

const API_KEY = import.meta.env.VITE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

export const GoogleLogin: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
        })
        .then(() => {
          gapi.client.load('drive', 'v3', console.log);
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
  return (
    <>
        {isSignedIn ? (
          <Button onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button onClick={handleLogin}>Login</Button>
        )}
      </>
  );
};
