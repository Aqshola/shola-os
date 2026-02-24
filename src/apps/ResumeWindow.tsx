import { createSignal, Show } from "solid-js";
import "../pages/Desktop/style/window.css";

interface ResumeWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
}

const RESUME_URL = "https://drive.google.com/file/d/1lZ-4Ef8c24O3e3FxLsRvK1vC5VkIKyWk/preview";

export default function ResumeWindow(props: ResumeWindowProps) {
    const [isMaximized, setIsMaximized] = createSignal(false);

    const handleClose = () => props.onClose();
    const handleMinimize = () => props.onMinimize();
    const handleMaximize = () => setIsMaximized(!isMaximized());

    return (
        <Show when={props.isOpen}>
            <div 
                class="window resume-window"
                classList={{ "window-maximized": isMaximized() }}
            >
                <div class="title-bar">
                    <div class="title-bar-text">Resume</div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize" onClick={handleMinimize}></button>
                        <button aria-label="Maximize" onClick={handleMaximize}></button>
                        <button aria-label="Close" onClick={handleClose}></button>
                    </div>
                </div>
                <div class="window-body" style={{border:"1px solid black", height:"450px"}}>
                    <iframe 
                        src={RESUME_URL} 
                        class="resume-iframe"
                        allow="autoplay"
                    />
                </div>
            </div>
        </Show>
    );
}
