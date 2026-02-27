import { createSignal, Show, onMount, onCleanup } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex, registerWindow, unregisterWindow } from "@/stores/windowStore";
import "@/pages/Desktop/style/window.css";

interface EmailWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
}

const WINDOW_ID = "email";

export default function EmailWindow(props: EmailWindowProps) {
    const [isMaximized, setIsMaximized] = createSignal(false);
    const [senderEmail, setSenderEmail] = createSignal("");
    const [content, setContent] = createSignal("");
    const draggable = useDraggable({ x: 150, y: 100 });

    onMount(() => {
        registerWindow(WINDOW_ID);
    });

    onCleanup(() => {
        unregisterWindow(WINDOW_ID);
    });

    const handleSend = () => {
        console.log("Send email:", { from: senderEmail(), content: content() });
        alert("Email sent! (Service not configured yet)");
        setSenderEmail("");
        setContent("");
        props.onClose();
    };

    const handleMaximize = () => setIsMaximized(!isMaximized());

    const handleTitleBarClick = () => {
        bringToFront(WINDOW_ID);
    };

    return (
        <Show when={props.isOpen}>
            <div 
                class="window email-window"
                classList={{ "window-maximized": isMaximized() }}
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
                    onMouseDown={draggable.handleMouseDown}
                >
                    <div class="title-bar-text">Email</div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize" onClick={props.onMinimize}></button>
                        <button aria-label="Maximize" onClick={handleMaximize}></button>
                        <button aria-label="Close" onClick={props.onClose}></button>
                    </div>
                </div>
                <div class="window-body">
                    <fieldset>
                        <legend>Send Email</legend>
                        <div class="field-row">
                            <label for="sender-email">From:</label>
                            <input
                                id="sender-email"
                                type="text"
                                value={senderEmail()}
                                onInput={(e) => setSenderEmail(e.currentTarget.value)}
                                placeholder="your@email.com"
                            />
                        </div>
                        <div class="field-row-stacked">
                            <label for="email-content">Content:</label>
                            <textarea
                                id="email-content"
                                rows={6}
                                value={content()}
                                onInput={(e) => setContent(e.currentTarget.value)}
                                placeholder="Write your message..."
                            />
                        </div>
                    </fieldset>
                    <div class="button-row">
                        <button class="default" onClick={handleSend}>Send</button>
                        <button onClick={props.onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </Show>
    );
}
