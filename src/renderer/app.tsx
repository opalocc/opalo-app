import React, { useState } from "react";
import { Drive } from "./components/Drive";
import { GoogleLogin } from "./components/GoogleLogin";
import { MD } from "./components/Markdown";


export function App() {
  const [content, setContent] = useState("#Hola");
  return (
    <div className="App">
      <GoogleLogin />
      <Drive onSelect={setContent} />
      <MD md={content}/>
    </div>
  )
}