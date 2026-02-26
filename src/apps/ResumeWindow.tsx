import { createSignal, Show } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex } from "@/stores/windowStore";
import "@/pages/Desktop/style/window.css";
import { useDeviceType } from "@/hooks/useDeviceType";

interface ResumeWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
}

const RESUME_URL = "https://drive.google.com/file/d/1lZ-4Ef8c24O3e3FxLsRvK1vC5VkIKyWk/preview";
const WINDOW_ID = "resume";

export default function ResumeWindow(props: ResumeWindowProps) {
    const [isMaximized, setIsMaximized] = createSignal(false);
    const defaultPosition = { x: window.innerWidth / 2, y: (window.innerHeight / 2) * -1 };
    const draggable = useDraggable({ x: defaultPosition.x, y: defaultPosition.y });
    const deviceType = useDeviceType();


    const handleClose = () => props.onClose();
    const handleMinimize = () => props.onMinimize();
    const handleMaximize = () => setIsMaximized(!isMaximized());

    const handleTitleBarClick = () => {
        bringToFront(WINDOW_ID);
    };

    return (
        <Show when={props.isOpen}>
            <div
                class="window resume-window"
                classList={{
                    "window-maximized": isMaximized(),
                    "resume-window-mobile": deviceType() === "mobile" && !isMaximized(),
                    "resume-window-desktop": deviceType() === "desktop" && !isMaximized()
                }}
                style={{
                    position: isMaximized() ? "fixed" : "absolute",
                    left: isMaximized() ? "0" : `${draggable.position().x}px`,
                    top: isMaximized() ? "0" : `${draggable.position().y}px`,
                    "z-index": getZIndex(WINDOW_ID),
                }}
                onMouseDown={handleTitleBarClick}
            >
                <div
                    class="title-bar"
                    onMouseDown={!isMaximized() ? draggable.handleMouseDown : undefined}
                >
                    <div class="title-bar-text">Resume</div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize" onClick={handleMinimize}></button>
                        <button aria-label="Maximize" onClick={handleMaximize}></button>
                        <button aria-label="Close" onClick={handleClose}></button>
                    </div>
                </div>
                <div class="window-body" style={{ border: "1px solid black", height: "450px" }}>
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
