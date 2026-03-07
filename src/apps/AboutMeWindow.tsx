import { createSignal, Show, onCleanup } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex, registerWindow, unregisterWindow } from "@/stores/windowStore";
import "@/pages/Desktop/style/window.css";
import { MODULE_ID } from "@/module/module-id";
import { useDeviceType } from "@/hooks/useDeviceType";

interface AboutMeWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
}

const WINDOW_ID = MODULE_ID.aboutme;

export default function AboutMeWindow(props: AboutMeWindowProps) {
    const [isMaximized, setIsMaximized] = createSignal(false);
    const defaultPosition = { x: window.innerWidth / 2, y: (window.innerHeight / 2) };
    const draggable = useDraggable({ x: defaultPosition.x, y: defaultPosition.y });
    const deviceType = useDeviceType();

    onCleanup(() => {
        unregisterWindow(WINDOW_ID);
    });

    const handleClose = () => props.onClose();
    const handleMinimize = () => props.onMinimize();
    const handleMaximize = () => setIsMaximized(!isMaximized());

    const handleTitleBarClick = () => {
        bringToFront(WINDOW_ID);
    };

    return (
        <Show when={props.isOpen}>
            <div
                class="window aboutme-window"
                classList={{
                    "window-maximized": isMaximized(),
                    "aboutme-window-mobile": deviceType() === "mobile" && !isMaximized(),
                    "aboutme-window-desktop": deviceType() === "desktop" && !isMaximized()
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
                    <div class="title-bar-text">About Me</div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize" onClick={handleMinimize}></button>
                        <button aria-label="Maximize" onClick={handleMaximize}></button>
                        <button aria-label="Close" onClick={handleClose}></button>
                    </div>
                </div>
                <div class="window-body aboutme-content" style={{ "background-color": "white", padding: "20px" }}>
                    <div class="aboutme-name" style={{
                        "font-size": "32px",
                        "font-weight": "bold",
                        "text-align": "center",
                        "margin-bottom": "20px"
                    }}>
                        Aqshol A
                    </div>
                    <div class="aboutme-description" style={{
                        "text-align": "center",
                        "font-size": "16px",
                        "color": "#333"
                    }}>
                        <p>Developer & Creator</p>
                        <p>Building cool things for the web</p>
                    </div>
                </div>
            </div>
        </Show>
    );
}
