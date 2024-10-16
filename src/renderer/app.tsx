import React, { useState } from "react";
import { Dashboard } from "./pages/dashboard";
import { Route, Routes } from "react-router-dom";
import { MD } from "./components/Markdown";
import { Editor } from "./components/Editor";
import { Login } from "./pages/login";


export function App() {
  return (
    <Routes>
      <Route path="/" index element={<Login />}/>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="/dashboard" element={<Editor />}/>
        <Route path="/dashboard/:id" element={<Editor />}/>
      </Route>
    </Routes>
  )
}