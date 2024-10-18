import React from 'react';
import { App } from './app';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GapiProvider } from './Providers/gapiProvider';
import { ThemeProvider } from "./Providers/ThemeProvider"

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <React.Suspense fallback={"Loading..."}>
      <BrowserRouter>
      <ThemeProvider storageKey="vite-ui-theme">
          <GapiProvider>
            <App />
          </GapiProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.Suspense>
  </React.StrictMode>
);
