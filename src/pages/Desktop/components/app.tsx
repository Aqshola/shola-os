import { appStore } from "@/stores/appStore";
import { removeActiveWindow,  } from "@/stores/windowStore";
import { createMemo, For, JSX } from "solid-js";

export default function App() {
    const appList=createMemo(()=>appStore().filter(app => app.type === "window"))
    return (
        <For each={appList()}>{(app) => {
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