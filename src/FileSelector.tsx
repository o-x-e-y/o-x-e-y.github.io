import type { Component } from "solid-js";
import { createSignal } from 'solid-js';

const FileSelector: Component = () => {
    const [item, setItem] = createSignal("Item 1");
    
    const clickItem = (event: MouseEvent & { currentTarget: HTMLButtonElement }) => {
        const thing = event.currentTarget.innerText;
        setItem(thing);
        console.log(`clicked ${thing}`);
    }
    
    return (
        <div class="w-full">
            <header class="bg-bright-black">
                <nav class="flex py-1">
                    <button onClick={clickItem} class="px-2 my-1 mr-1 bg-background">&lt;-</button>
                    <button onClick={clickItem} class="px-2 m-1 bg-background">-&gt;</button>
                    <button onClick={clickItem} class="m-1 px-2 bg-background">Item 1</button>
                    <button onClick={clickItem} class="m-1 px-2 bg-background">Item 2</button>
                    <button onClick={clickItem} class="m-1 px-2 bg-background">Item 3</button>
                    <button onClick={clickItem} class="m-1 px-2 bg-background">Item 4</button>
                </nav>
            </header>
            <div class="border-b-2 border-bright-black">
                <div class="p-2">{ item() }</div>
            </div>
        </div>
    );
};

export default FileSelector;
