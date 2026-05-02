import type { Component } from 'solid-js';
import Sidebar from './Sidebar';
import FileSelector from './FileSelector';
import Editor from './Editor';

const App: Component = () => {
  return (
        <div class="flex text-foreground">
            <Sidebar/>
            <div class="w-full">
                <FileSelector/>
                <Editor/>
            </div>
        </div>
  );
};

export default App;
