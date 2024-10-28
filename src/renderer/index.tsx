import React from 'react';
import { App } from './app';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CloudStorageProvider } from './providers/CloudStorageProvider';
import { ThemeProvider } from './providers/ThemeProvider';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <React.Suspense fallback={'Loading...'}>
      <BrowserRouter>
        <ThemeProvider storageKey="vite-ui-theme">
          <CloudStorageProvider>
            <App />
          </CloudStorageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.Suspense>
  </React.StrictMode>
);
