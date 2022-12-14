import React from 'react';
import { createRoot } from 'react-dom/client';
import IconsGallery from './IconsGallery';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IconsGallery />
  </React.StrictMode>
)
