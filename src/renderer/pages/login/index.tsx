import React, { useEffect, useState } from "react";
import opalo from "./opalo.png";
import { GoogleLogin } from "@/renderer/components/GoogleLogin";
import { useNavigate } from "react-router-dom";
import { useGapi } from "@/renderer/hooks/gapi";

export function Login() {
  const navigate = useNavigate();
  const {gapi}: any = useGapi()

  useEffect(() => {
    const authInstance = gapi.auth2?.getAuthInstance();
      if (!gapi || !authInstance)
          return
      if(authInstance.isSignedIn.get())
        navigate('/dashboard')
  }, [gapi]);
  return (
    <div className="min-h-screen w-full">
    <div className=" flex min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
          </div>
          <div className="grid gap-4">
            <GoogleLogin onLogin={() => navigate('/dashboard')} />
          </div>
        </div>
      </div>
      <div className="flex bg-muted">
        <img
        style={{margin: "auto"}}
            src={opalo}
            height={500}
            width={500}
        />
      </div>
    </div>
    </div>
  )
}
