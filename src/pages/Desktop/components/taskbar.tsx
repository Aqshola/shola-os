import { createSignal, onCleanup, Show, For, JSX, createMemo } from "solid-js";
import "@/pages/Desktop/style/taskbar.css"
import { registerWindow, windowStore, addActiveWindow } from "@/stores/windowStore";
import { MODULE_ID } from "@/module/module-id";
import { appStore } from "@/stores/appStore";

export default function Taskbar() {
    const [time, setTime] = createSignal(new Date());
    const [startMenuOpen, setStartMenuOpen] = createSignal(false);

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


    const startApp = appStore().filter(app => app.showIn.start)
    const taskbarApp = appStore().filter(app => app.showIn.taskbar)

    const activeApps = createMemo(() =>
        windowStore.activeWindows
            .map(id => appStore().find(a => a.id === id))
            .filter(Boolean)
    );




    return (
        <div class="taskbar">
            {/* Start Button & Menu */}
            <div>
                <button
                    class="taskbar-button-start"
                    classList={{ active: startMenuOpen() }}
                    onClick={toggleStartMenu}
                >
                    <img src="/assets/icons/SO_Logo.webp" alt="Start" class="taskbar-button-start-icon" />
                    <span>Start</span>
                </button>

                <Show when={startMenuOpen()}>
                    <div class="window start-menu show">
                        <div class="start-menu-sidebar">
                            <span>Shola OS</span>
                        </div>
                        <div class="start-menu-items">
                            <For each={startApp}>{(app) => (
                                <button class="start-menu-item" onClick={() => {
                                    if (app.type == "window") {
                                        addActiveWindow(app)
                                        closeStartMenu()
                                        registerWindow(app.id)
                                    }
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
                <For each={taskbarApp}>{(app) => (
                    <button class="taskbar-button-app" onClick={() => {
                        if (app.type == "window") {
                            addActiveWindow(app)
                            closeStartMenu()
                            registerWindow(app.id)
                        }
                        app.action()
                    }}>
                        <img src={app.icon} alt={app.title} class="taskbar-button-icon" />
                    </button>
                )}</For>
            </div>

            <div class="taskbar-windows">
                <For each={activeApps() }>{(win) => win && (
                    <button
                        class="taskbar-window-app"
                        classList={{ inactive: win.hooks?.isMinimized() }}
                        onClick={() => {
                            if (win.hooks?.isMinimized()) {
                                win.hooks?.restore()

                                if (win.id == MODULE_ID.portofolio) {
                                    const portofolioHooks = win.hooks as any
                                    const openProjectId = portofolioHooks.openProjectId()
                                    if (openProjectId) {
                                        registerWindow(`portfolio-content-${openProjectId}`)
                                    }
                                }
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





        </div>
    )
}
