import { createSignal, onCleanup, Show } from "solid-js";
import { LIST_TASKBAR_APP } from "../../../apps/taskbar-app"
import EmailWindow from "../../../apps/EmailWindow"
import ResumeWindow from "../../../apps/ResumeWindow"
import "../style/taskbar.css"

const APP_LINKS = {
    portfolio: { url: "https://portfolio-terminal-shola.netlify.app", icon: "/assets/icons/kodak_imaging.ico" },
    github: { url: "https://github.com/aqshol-claw", icon: "/assets/icons/github.ico" },
    resume: { url: "#", icon: "/assets/icons/certificate_2.ico" },
    linkedin: { url: "https://linkedin.com/in/aqshol", icon: "/assets/icons/linkedin.ico" },
    email: { url: "mailto:aqsholclaw@gmail.com", icon: "/assets/icons/mailbox_world.ico" }
};

export default function Taskbar() {
    const [time, setTime] = createSignal(new Date());
    const [startMenuOpen, setStartMenuOpen] = createSignal(false);
    const [emailWindowOpen, setEmailWindowOpen] = createSignal(false);
    
    // Resume window state
    const [resumeOpen, setResumeOpen] = createSignal(false);
    const [resumeMinimized, setResumeMinimized] = createSignal(false);

    // Equivalent to useEffect(..., [])
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Cleanup to prevent memory leaks
    onCleanup(() => clearInterval(timer));

    const toggleStartMenu = () => setStartMenuOpen(!startMenuOpen());

    const openEmailWindow = () => {
        setStartMenuOpen(false);
        setEmailWindowOpen(true);
    };

    const openResumeWindow = () => {
        setStartMenuOpen(false);
        setResumeOpen(true);
        setResumeMinimized(false);
    };

    const closeResumeWindow = () => {
        setResumeOpen(false);
        setResumeMinimized(false);
    };

    const minimizeResumeWindow = () => {
        setResumeMinimized(true);
    };

    const restoreResumeWindow = () => {
        setResumeMinimized(false);
        setResumeOpen(true);
    };

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
            <div>
                <button 
                    class="taskbar-button-start"
                    classList={{ active: startMenuOpen() }}
                    onClick={toggleStartMenu}
                >
                    <i>
                        <img src="/assets/icons/start.svg" alt="Start" class="taskbar-button-start-icon" />
                    </i>
                    <span>
                        Start
                    </span>
                </button>
                <Show when={startMenuOpen()}>
                    <div class="window start-menu show">
                        <div class="start-menu-sidebar">
                            <span>Aqshol OS</span>
                        </div>
                        <div class="start-menu-items">
                        <a href={APP_LINKS.portfolio.url} target="_blank" rel="noopener noreferrer" class="start-menu-item">
                                <img src={APP_LINKS.portfolio.icon} alt="" />
                                <span>Portfolio</span>
                            </a>

                        <button class="start-menu-item" onClick={openResumeWindow}>
                                <img src={APP_LINKS.resume.icon} alt="" />
                                <span>Resume</span>
                            </button>
                        <a href={APP_LINKS.github.url} target="_blank" rel="noopener noreferrer" class="start-menu-item">
                                <img src={APP_LINKS.github.icon} alt="" />
                                <span>Github</span>
                            </a>
                        <a href={APP_LINKS.linkedin.url} target="_blank" rel="noopener noreferrer" class="start-menu-item">
                                <img src={APP_LINKS.linkedin.icon} alt="" />
                                <span>LinkedIn</span>
                            </a>
                        <button class="start-menu-item" onClick={openEmailWindow}>
                                <img src={APP_LINKS.email.icon} alt="" />
                                <span>Email</span>
                            </button>
                        </div>
                    </div>
                </Show>
            </div>


            <div class="taskbar-divider"></div>

            <div class="taskbar-apps">
                {LIST_TASKBAR_APP.map((app) => (
                    <button class="taskbar-button-app">
                        <i>
                            <img src={app.icon} alt={app.alt} class="taskbar-button-icon" />
                        </i>
                    </button>
                ))}
                
                {/* Open windows */}
                <Show when={resumeOpen() || resumeMinimized()}>
                    <button 
                        class="taskbar-button-app"
                        classList={{ active: resumeOpen() && !resumeMinimized() }}
                        onClick={resumeMinimized() ? restoreResumeWindow : undefined}
                    >
                        <img src={APP_LINKS.resume.icon} alt="Resume" class="taskbar-button-icon" />
                    </button>
                </Show>
            </div>

            <div class="taskbar-tray">
                <div class="taskbar-tray-icons">
                    {/* Add tray icons here later if needed */}
                </div>
                <div class="taskbar-clock">
                    {formatTime(time())}
                </div>
            </div>

            <EmailWindow
                isOpen={emailWindowOpen()}
                onClose={() => setEmailWindowOpen(false)}
            />
            
            <ResumeWindow
                isOpen={resumeOpen() && !resumeMinimized()}
                onClose={closeResumeWindow}
                onMinimize={minimizeResumeWindow}
                onRestore={restoreResumeWindow}
            />
        </div>


    )
}