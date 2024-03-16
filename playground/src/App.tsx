/* eslint-disable react/jsx-no-target-blank */
// import { useState } from 'react';
// import reactLogo from './assets/react.svg';
// import { FrankyEditor } from '@franky-editor/reactEditor';
// eslint-disable-next-line import/no-unresolved

import './App.css';
import { useEffect } from 'react';

function App() {
  /* useEffect(() => {
    if (window.editor) {
      console.log('useEffect');
      window.editor = new FrankyApi(
        new FrankyEditor(document.getElementById('editor') as HTMLElement, {}),
        {
          content: 'content',
        },
      );
    }
  }, []); */
  // const [count, setCount] = useState(0);
  return (
    <div className="App" id="editor">
      {/* <FrankyEditor /> */}
    </div>
  );
}

export default App;
