import React from "react";
import { Drive } from "./components/Drive";
import { GoogleLogin } from "./components/GoogleLogin";


export function App() {
  return (
    <div className="App">
      <GoogleLogin />
      <Drive />
    </div>
  )
}