import React from 'react';
import { createRoot } from 'react-dom/client';
import DatalayerIcons from './DatalayerIcons';

if (!('process' in window)) {
  // @ts-ignore
  window.process = {}
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DatalayerIcons />
  </React.StrictMode>
)
