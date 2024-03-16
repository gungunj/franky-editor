import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FrankyEditor } from '@franky-editor/core';
import './index.css';

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );
FrankyEditor.initEditor(document.getElementById('root') as HTMLElement, {
  content: 'content',
});
