import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';


const rootElement = document.getElementById('root')!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
