import React from 'react';
import { createRoot } from 'react-dom/client';
import process from 'socket:process';
import { initalizeMenu } from 'src/lib/application';

if (process.env.DEBUG) {
  console.log('started in debug mode');
}

// components
import App from './components/App';

// setup appplication
initalizeMenu();

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
