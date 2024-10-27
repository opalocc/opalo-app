import React, { useEffect, useState } from "react";
import { Button } from "@/renderer/components/ui/button"
import { useGapi } from "@/renderer/hooks/gapi";

export const GoogleLogin = ({onLogin, onLogout}: any) => {
  const [loggedOn, setLoggedOn] = useState(false);
  const {loaded, isSignedIn}: any = useGapi()

  useEffect(() => {
      (async () =>setLoggedOn(await isSignedIn()))();
  }, [loaded]);
  return (
    <>
        {loggedOn ? (
          <Button size="sm" className="w-full" onClick={onLogout}>
            Logout
          </Button>
        ) : (
          <Button size="sm" className="w-full" onClick={onLogin}>Login</Button>
        )}
      </>
  );
};
