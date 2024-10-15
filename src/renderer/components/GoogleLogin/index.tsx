import React, { useEffect, useState } from "react";
import { Button } from "@/renderer/components/ui/button"
import { useGapi } from "@/renderer/hooks/gapi";

const API_KEY = import.meta.env.VITE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

export const GoogleLogin: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const {gapi}: any = useGapi()

  useEffect(() => {

    const authInstance = gapi.auth2?.getAuthInstance();
      if (!gapi || !authInstance)
          return
      setIsSignedIn(authInstance.isSignedIn.get());
      authInstance.isSignedIn.listen(setIsSignedIn);
  }, [gapi]);

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleLogout = () => {
    gapi.auth2.getAuthInstance().signOut();
  };
  return (
    <>
        {isSignedIn ? (
          <Button size="sm" className="w-full" onClick={() => handleLogout()}>
            Logout
          </Button>
        ) : (
          <Button size="sm" className="w-full" onClick={() => handleLogin()}>Login</Button>
        )}
      </>
  );
};
