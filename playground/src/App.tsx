import { FrankyEditor } from '@franky-editor/reactEditor';

import './App.css';
import { useEffect } from 'react';

function App() {
  return (
    <div className="App" id="editor">
      <FrankyEditor content="content" />
    </div>
  );
}

export default App;
