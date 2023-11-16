import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DatalayerIcons from './DatalayerIcons';

const div = document.createElement('div');
document.body.appendChild(div);
const root = createRoot(div);

root.render(
  <StrictMode>
    <DatalayerIcons />
  </StrictMode>
);
