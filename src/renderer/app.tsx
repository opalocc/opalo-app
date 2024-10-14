import React, { useState } from "react";
import { Dashboard } from "./pages/dashboard";


export function App() {
  const [content, setContent] = useState("#Hola");
  return (
    <Dashboard />
  )
}