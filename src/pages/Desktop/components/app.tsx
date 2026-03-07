import { removeActiveWindow, windowStore } from "@/stores/windowStore";
import { For, JSX } from "solid-js";

export default function App() {

    return (
        <For each={windowStore.appList.filter(app => app.type === "window")}>{(app) => {
            const Component = app.component as (props: any) => JSX.Element;

            return (
                <Component
                    isOpen={app.hooks?.isActive()}
                    onClose={() => {
                        app.hooks?.close()
                        removeActiveWindow(app)
                    }}
                    onMinimize={app.hooks?.minimize}
                    onRestore={app.hooks?.restore}
                    hooks={app.hooks}
                />
            );
        }}</For>
    )
}