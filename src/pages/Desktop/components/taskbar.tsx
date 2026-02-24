import { createSignal, onCleanup, Show, For, JSX } from "solid-js";
import { initializeStartApps, StartApp } from "@/module/start-module"
import "../style/taskbar.css"
import { LIST_TASKBAR_APP } from "@/module/taskbar-module";

export default function Taskbar() {
    const appStart = initializeStartApps()

    const [time, setTime] = createSignal(new Date());
    const [startMenuOpen, setStartMenuOpen] = createSignal(false);
    const [activeWindows, setActiveWindows] = createSignal<StartApp[]>([]);

    const timer = setInterval(() => setTime(new Date()), 1000);
    onCleanup(() => clearInterval(timer));

    // Start menu
    const toggleStartMenu = () => setStartMenuOpen(!startMenuOpen());
    const closeStartMenu = () => setStartMenuOpen(false);


    const formatTime = (date: Date) => {
        let hours = date.getHours();
        let minutes: string | number = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    };



    return (
        <div class="taskbar">
            {/* Start Button & Menu */}
            <div>
                <button
                    class="taskbar-button-start"
                    classList={{ active: startMenuOpen() }}
                    onClick={toggleStartMenu}
                >
                    <img src="/assets/icons/start.svg" alt="Start" class="taskbar-button-start-icon" />
                    <span>Start</span>
                </button>

                <Show when={startMenuOpen()}>
                    <div class="window start-menu show">
                        <div class="start-menu-sidebar">
                            <span>Aqshol OS</span>
                        </div>
                        <div class="start-menu-items">
                            <For each={appStart.LIST_START_APP}>{(app) => (
                                <button class="start-menu-item" onClick={() => {
                                    setActiveWindows(prev => [...prev, app]);
                                    closeStartMenu()
                                    app.action()

                                }
                                }>
                                    <img src={app.icon} alt="" />
                                    <span>{app.title}</span>
                                </button>
                            )}</For>
                        </div>
                    </div>
                </Show>
            </div>

            <div class="taskbar-divider"></div>

            <div class="taskbar-apps">
                <For each={LIST_TASKBAR_APP}>{(app) => (
                    <button class="taskbar-button-app">
                        <img src={app.icon} alt={app.alt} class="taskbar-button-icon" />
                    </button>
                )}</For>              
            </div>

            <div class="taskbar-windows">
                  <For each={activeWindows()}>{(win) => win && (
                    <button
                        class="taskbar-window-app"
                        classList={{ inactive: win.hooks?.isMinimized() }}
                        onClick={()=>{
                            if(win.hooks?.isMinimized()){
                                win.hooks?.restore()
                            } else {
                                win.hooks?.minimize()
                            }
                        }}
                    >
                        <img src={win.icon} alt={win.title} class="taskbar-window-app-icon" />
                        <span>{win.title}</span>
                    </button>
                )}</For>
            </div>

            {/* System Tray */}
            <div class="taskbar-tray">
                <div class="taskbar-clock">
                    {formatTime(time())}
                </div>
            </div>


            <For each={appStart.LIST_START_APP.filter(app => app.type === "window")}>{(app) => {
                const Component = app.component as (props: any) => JSX.Element;
                return (
                    <Component
                        isOpen={app.hooks?.isActive()}
                        onClose={()=>{
                            app.hooks?.close()
                            setActiveWindows(prev => prev.filter(w => w.title !== app.title))
                        }}
                        onMinimize={app.hooks?.minimize}
                        onRestore={app.hooks?.restore}
                    />
                );
            }}</For>


        </div>
    )
}
