import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setupPrimerPortals } from '@datalayer/primer-addons/lib/utils/Portals';
import { App } from './App';

import '../style/primer-primitives.css';

setupPrimerPortals();

const div = document.createElement('div');
document.body.appendChild(div);
const root = createRoot(div);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
