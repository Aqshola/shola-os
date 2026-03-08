import { createSignal, Show } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex } from "@/stores/windowStore";
import "@/pages/Desktop/style/window.css";

interface MessageBoxProps {
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

const WINDOW_ID = "messagebox";

export default function MessageBox(props: MessageBoxProps) {
    const defaultPosition = { x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 75 };
    const draggable = useDraggable({ x: defaultPosition.x, y: defaultPosition.y });

    const handleTitleBarClick = () => {
        bringToFront(WINDOW_ID);
    };

    const handleOk = () => {
        props.onClose();
    };

    return (
        <Show when={props.isOpen}>
            <div
                class="window"
                style={{
                    position: "absolute",
                    left: `${draggable.position().x}px`,
                    top: `${draggable.position().y}px`,
                    "z-index": getZIndex(WINDOW_ID),
                    width: "300px",
                }}
                onMouseDown={handleTitleBarClick}
            >
                <div
                    class="title-bar"
                    onMouseDown={draggable.handleMouseDown}
                >
                    <div class="title-bar-text">{props.title}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" onClick={props.onClose}></button>
                    </div>
                </div>
                <div class="window-body" style={{ "text-align": "center", padding: "20px" }}>
                    <p style={{ "margin-bottom": "20px", "font-size": "14px" }}>
                        {props.type === "success" ? "✅ " : "❌ "}
                        {props.message}
                    </p>
                    <button class="default" onClick={handleOk}>OK</button>
                </div>
            </div>
        </Show>
    );
}
