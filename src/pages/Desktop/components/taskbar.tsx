import { createSignal, onCleanup, Show, For } from "solid-js";
import { LIST_TASKBAR_APP } from "../../../module/taskbar-module"
import { START_APP_CONFIG } from "../../../module/start-module"
import { useResume } from "../../../hooks/useResume"
import { useEmail } from "../../../hooks/useEmail"
import ResumeWindow from "../../../apps/ResumeWindow"
import EmailWindow from "../../../apps/EmailWindow"
import "../style/taskbar.css"

export default function Taskbar() {
    const [time, setTime] = createSignal(new Date());
    const [startMenuOpen, setStartMenuOpen] = createSignal(false);

    // App hooks
    const resume = useResume();
    const email = useEmail();

    // Timer
    const timer = setInterval(() => setTime(new Date()), 1000);
    onCleanup(() => clearInterval(timer));

    // Start menu
    const toggleStartMenu = () => setStartMenuOpen(!startMenuOpen());
    const closeStartMenu = () => setStartMenuOpen(false);

    // App actions
    const openPortfolio = () => {
        closeStartMenu();
        window.open(START_APP_CONFIG.portfolio.url, "_blank");
    };

    const openGithub = () => {
        closeStartMenu();
        window.open(START_APP_CONFIG.github.url, "_blank");
    };

    const openLinkedIn = () => {
        closeStartMenu();
        window.open(START_APP_CONFIG.linkedin.url, "_blank");
    };

    const openResume = () => {
        closeStartMenu();
        resume.open();
    };

    const openEmail = () => {
        closeStartMenu();
        email.open();
    };

    // Start menu apps list
    const startApps = [
        { ...START_APP_CONFIG.portfolio, action: openPortfolio },
        { ...START_APP_CONFIG.resume, action: openResume },
        { ...START_APP_CONFIG.github, action: openGithub },
        { ...START_APP_CONFIG.linkedin, action: openLinkedIn },
        { ...START_APP_CONFIG.email, action: openEmail },
    ];

    // Taskbar tabs for open windows
    const openWindows = [
        resume.isActive() || resume.isMinimized() ? { 
            id: "resume", 
            icon: START_APP_CONFIG.resume.icon, 
            isActive: resume.isActive(), 
            onClick: resume.toggle 
        } : null,
        email.isActive() ? { 
            id: "email", 
            icon: START_APP_CONFIG.email.icon, 
            isActive: email.isActive(), 
            onClick: email.toggle 
        } : null,
    ].filter(Boolean);

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
                            <For each={startApps}>{(app) => (
                                <button class="start-menu-item" onClick={app.action}>
                                    <img src={app.icon} alt="" />
                                    <span>{app.title}</span>
                                </button>
                            )}</For>
                        </div>
                    </div>
                </Show>
            </div>

            <div class="taskbar-divider"></div>

            {/* Taskbar Apps */}
            <div class="taskbar-apps">
                <For each={LIST_TASKBAR_APP}>{(app) => (
                    <button class="taskbar-button-app">
                        <img src={app.icon} alt={app.alt} class="taskbar-button-icon" />
                    </button>
                )}</For>
                
                {/* Open Windows Tabs */}
                <For each={openWindows}>{(win) => win && (
                    <button 
                        class="taskbar-button-app"
                        classList={{ active: win.isActive }}
                        onClick={win.onClick}
                    >
                        <img src={win.icon} alt={win.id} class="taskbar-button-icon" />
                    </button>
                )}</For>
            </div>

            {/* System Tray */}
            <div class="taskbar-tray">
                <div class="taskbar-clock">
                    {formatTime(time())}
                </div>
            </div>

            {/* Window Components */}
            <ResumeWindow
                isOpen={resume.isActive()}
                onClose={resume.close}
                onMinimize={resume.minimize}
                onRestore={resume.restore}
            />
            
            <EmailWindow
                isOpen={email.isOpen()}
                onClose={email.close}
            />
        </div>
    )
}
