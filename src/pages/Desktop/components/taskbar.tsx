import { createSignal, onCleanup, Show } from "solid-js";
import { LIST_TASKBAR_APP } from "../../../apps/taskbar-app"
import "../style/taskbar.css"

const APP_LINKS = {
    portfolio: "https://portfolio-terminal-shola.netlify.app",
    github: "https://github.com/aqshol-claw",
    resume: "#",
    email: "mailto:aqsholclaw@gmail.com",
    linkedin: "https://linkedin.com/in/aqshol"
};

export default function Taskbar() {
    const [time, setTime] = createSignal(new Date());
    const [startMenuOpen, setStartMenuOpen] = createSignal(false);

    // Equivalent to useEffect(..., [])
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Cleanup to prevent memory leaks
    onCleanup(() => clearInterval(timer));

    const toggleStartMenu = () => setStartMenuOpen(!startMenuOpen());

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
                        <a href={APP_LINKS.portfolio} target="_blank" rel="noopener noreferrer" class="start-menu-item">
                                <span>Portfolio</span>
                            </a>

                        <a href={APP_LINKS.resume} target="_blank" rel="noopener noreferrer" class="start-menu-item">
                                <span>Resume</span>
                            </a>
                        <a href={APP_LINKS.github} target="_blank" rel="noopener noreferrer" class="start-menu-item">
                                <span>Github</span>
                            </a>
                        <a href={APP_LINKS.linkedin} target="_blank" rel="noopener noreferrer" class="start-menu-item">
                                <span>LinkedIn</span>
                            </a>
                        <a href={APP_LINKS.email} class="start-menu-item">
                                <span>Email</span>
                            </a>
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
            </div>

            <div class="taskbar-tray">
                <div class="taskbar-tray-icons">
                    {/* Add tray icons here later if needed */}
                </div>
                <div class="taskbar-clock">
                    {formatTime(time())}
                </div>
            </div>
        </div>


    )
}