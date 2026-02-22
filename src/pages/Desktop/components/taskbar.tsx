import { createSignal, onCleanup } from "solid-js";
import { LIST_TASKBAR_APP } from "../../../apps/taskbar-app"
import "../style/taskbar.css"
export default function Taskbar() {
    const [time, setTime] = createSignal(new Date());

    // Equivalent to useEffect(..., [])
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Cleanup to prevent memory leaks
    onCleanup(() => clearInterval(timer));

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
                <button class="taskbar-button-start">
                    <i>
                        <img src="/assets/icons/start.svg" alt="Start" class="taskbar-button-start-icon" />
                    </i>
                    <span>
                        Start
                    </span>
                </button>
                <div class="window start-menu" >
                    <div class="start-menu-sidebar">
                        <span>Aqshol OS</span>
                    </div>
                    <div class="start-menu-items">
                       <button
                        class="start-menu-item"
                    >
                        
                       <span>Portofolio</span>
                    </button>

                    <button
                        class="start-menu-item"
                    >
                        
                       <span>Resume</span>
                    </button>
                    <button
                        class="start-menu-item"
                    >
                        
                       <span>Github</span>
                    </button>
                    <button
                        class="start-menu-item"
                    >
                        
                       <span>LInkedin</span>
                    </button>
                    </div>
                </div>
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