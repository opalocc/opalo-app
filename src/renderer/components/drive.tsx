import React, { ReactElement, useEffect, useState } from "react";
import { gapi } from "gapi-script";

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
  "https://www.googleapis.com/discovery/v1/apis/people/v1/rest",
];
const SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly";
const API_KEY = import.meta.env.VITE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

let done = false;

const initClient = (options: {
  updateLoggedInStatus: (status: boolean) => void;
}) => {
  if (done) {
    return;
  }
  done = true;
  gapi.client
    .init({
      apiKey: API_KEY,
      client_id: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(() => {
      // Listen for sign-in state changes.
      console.log("gapi.auth2", gapi.auth2);

      gapi.auth2
        .getAuthInstance()
        .isSignedIn.listen(options.updateLoggedInStatus);

      // Handle the initial sign-in state.
      options.updateLoggedInStatus(
        gapi.auth2.getAuthInstance().isSignedIn.get()
      );
    })
    .catch((err: any) => {
      console.error("Caught error", err);
    });
};

function LogInOutButton(options: {
  loggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
}): ReactElement {
  const { loggedIn, logIn, logOut } = options;
  const buttonText = loggedIn ? "Log out" : "Log in";
  const buttonAction = loggedIn ? logOut : logIn;

  return <button onClick={buttonAction}>{buttonText}</button>;
}

export function GDrive(): ReactElement {
  const [loggedInStatus, setLoggedInStatus] = useState<boolean>(false);
  const [initiatedClient, setInitiatedClient] = useState<boolean>(false);

  useEffect(() => {
    gapi.load("client:auth2", () =>
      initClient({
        updateLoggedInStatus: (status) => {
          console.log("Login status", status);
          setLoggedInStatus(status);
        },
      })
    );

    setInitiatedClient(true);
  }, [initiatedClient]);

  return (
    <div>
      <div>You are {loggedInStatus ? "" : "not"} signed in</div>
      <LogInOutButton
        loggedIn={loggedInStatus}
        logIn={() => gapi.auth2.getAuthInstance().signIn()}
        logOut={() => gapi.auth2.getAuthInstance().signOut()}
      />
    </div>
  );
}