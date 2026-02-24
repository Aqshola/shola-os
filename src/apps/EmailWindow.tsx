import { createSignal, Show } from "solid-js";
import "../pages/Desktop/style/window.css";

interface EmailWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EmailWindow(props: EmailWindowProps) {
    const [senderEmail, setSenderEmail] = createSignal("");
    const [content, setContent] = createSignal("");

    const handleSend = () => {
        // TODO: Connect email service later
        console.log("Send email:", { from: senderEmail(), content: content() });
        alert("Email sent! (Service not configured yet)");
        setSenderEmail("");
        setContent("");
        props.onClose();
    };

    return (
        <Show when={props.isOpen}>
            <div class="window email-window">
                <div class="title-bar">
                    <div class="title-bar-text">Email</div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize"></button>
                        <button aria-label="Maximize"></button>
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
