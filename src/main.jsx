import React from 'react';
import { createRoot } from 'react-dom/client';
import SynestheticaPage from './app/SynestheticaPage';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<SynestheticaPage />);
