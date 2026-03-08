import { createSignal, Show, onMount, onCleanup } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex, registerWindow, unregisterWindow } from "@/stores/windowStore";
import "@/pages/Desktop/style/window.css";
import { MODULE_ID } from "@/module/module-id";
import { useDeviceType } from "@/hooks/useDeviceType";
import { sendEmail } from "@/services/email";
import MessageBox from "@/apps/MessageBox";

interface EmailWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
}

const WINDOW_ID = MODULE_ID.email;

export default function EmailWindow(props: EmailWindowProps) {
    const [isMaximized, setIsMaximized] = createSignal(false);
    const [senderEmail, setSenderEmail] = createSignal("");
    const [content, setContent] = createSignal("");
    const [messageBox, setMessageBox] = createSignal<{ isOpen: boolean; type: "success" | "error"; message: string }>({
        isOpen: false,
        type: "success",
        message: ""
    });
    const defaultPosition = { x: window.innerWidth / 2, y: (window.innerHeight / 2) };

    const draggable = useDraggable({ x: defaultPosition.x, y: defaultPosition.y });
    const deviceType = useDeviceType();


    onCleanup(() => {
        unregisterWindow(WINDOW_ID);
    });

    const handleSend = async () => {
        if (!senderEmail() || !content()) {
            setMessageBox({ isOpen: true, type: "error", message: "Please fill in all fields." });
            return;
        }
        
        const success = await sendEmail(senderEmail(), content());
        if (success) {
            setMessageBox({ isOpen: true, type: "success", message: "Email sent successfully!" });
            setSenderEmail("");
            setContent("");
        } else {
            setMessageBox({ isOpen: true, type: "error", message: "Failed to send email. Please try again." });
        }
    };

    const handleMaximize = () => setIsMaximized(!isMaximized());

    const handleTitleBarClick = () => {
        bringToFront(WINDOW_ID);
    };

    return (
        <Show when={props.isOpen}>
            <div
                class="window email-window"
                classList={{
                    "window-maximized": isMaximized(),
                    "email-window-mobile": deviceType() === "mobile" && !isMaximized(),
                    "email-window-desktop": deviceType() === "desktop" && !isMaximized()
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
            <MessageBox
                isOpen={messageBox().isOpen}
                title={messageBox().type === "success" ? "Success" : "Error"}
                message={messageBox().message}
                type={messageBox().type}
                onClose={() => setMessageBox((prev) => ({ ...prev, isOpen: false }))}
            />
        </Show>
    );
}
