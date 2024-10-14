import React, { useState } from "react";
import { Dashboard } from "./pages/dashboard";
import { Route, Routes } from "react-router-dom";
import { MD } from "./components/Markdown";


export function App() {
  const [content, setContent] = useState("#Hola");
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route path="/" element={<MD />}/>
        <Route path="/:id" element={<MD />}/>
      </Route>
    </Routes>
  )
}