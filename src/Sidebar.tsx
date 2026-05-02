import type { Component } from "solid-js";

const Sidebar: Component = () => {
    return (
        <div class="w-72 min-h-[100vh] bg-bright-black">
            <div class="p-2 m-2 bg-background">Item 1</div>
            <div class="p-2 m-2 bg-background">Item 2</div>
            <div class="p-2 m-2 bg-background">Item 3</div>
            <div class="p-2 m-2 bg-background">Item 4</div>
            <div class="p-2 m-2 bg-background">Item 5</div>
            <div class="p-2 m-2 bg-background">Item 6</div>
        </div>
    );
};

export default Sidebar;
