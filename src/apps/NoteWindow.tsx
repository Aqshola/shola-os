import { Show, createSignal, createEffect, onCleanup } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex, registerWindow, unregisterWindow } from "@/stores/windowStore";
import "@/pages/Desktop/style/window.css";
import { Note } from "@/services/notes";

interface NoteWindowProps {
    noteId: string | null;
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
    hooks: any;
}

const WINDOW_ID_PREFIX = "note-";

export default function NoteWindow(props: NoteWindowProps) {
    const [isMaximized, setIsMaximized] = createSignal(false);
    const [title, setTitle] = createSignal("");
    const [content, setContent] = createSignal("");
    const [isSaved, setIsSaved] = createSignal(true);

    const defaultPosition = { x: window.innerWidth / 2 - 175, y: (window.innerHeight / 2) - 100 };
    const draggable = useDraggable({ x: defaultPosition.x, y: defaultPosition.y });

    const notes = props.hooks;

    // Load note data when noteId changes
    createEffect(() => {
        const noteId = props.noteId;
        if (noteId) {
            const noteList = notes.notes();
            const note = noteList.find((n: Note) => n.id === noteId);
            if (note) {
                setTitle(note.title);
                setContent(note.content);
                setIsSaved(true);
                registerWindow(`${WINDOW_ID_PREFIX}${noteId}`);
            }
        }
    });

    onCleanup(() => {
        if (props.noteId) {
            unregisterWindow(`${WINDOW_ID_PREFIX}${props.noteId}`);
        }
    });

    const handleClose = () => {
        if (!isSaved()) {
            // Auto-save on close
            handleSave();
        }
        props.onClose();
        if (props.noteId) {
            unregisterWindow(`${WINDOW_ID_PREFIX}${props.noteId}`);
        }
    };

    const handleMinimize = () => props.onMinimize();
    const handleMaximize = () => setIsMaximized(!isMaximized());

    const handleTitleBarClick = () => {
        if (props.noteId) {
            bringToFront(`${WINDOW_ID_PREFIX}${props.noteId}`);
        }
    };

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        setIsSaved(false);
    };

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        setIsSaved(false);
    };

    const handleSave = async () => {
        if (!props.noteId || !title().trim()) return;

        const updated = await notes.updateExistingNote(props.noteId, title(), content());
        if (updated) {
            setIsSaved(true);
        }
    };

    const isCreateMode = () => !props.noteId;

    return (
        <Show when={props.noteId}>
            <div
                class="window note-detail-window"
                classList={{ "window-maximized": isMaximized() }}
                style={{
                    position: isMaximized() ? "fixed" : "absolute",
                    left: isMaximized() ? "0" : `${draggable.position().x}px`,
                    top: isMaximized() ? "0" : `${draggable.position().y}px`,
                    width: isMaximized() ? "100%" : "350px",
                    height: isMaximized() ? "calc(100vh - 28px)" : "300px",
                    "z-index": getZIndex(`${WINDOW_ID_PREFIX}${props.noteId}`),
                }}
                onMouseDown={handleTitleBarClick}
            >
                <div
                    class="title-bar"
                    onMouseDown={!isMaximized() ? draggable.handleMouseDown : undefined}
                >
                    <div class="title-bar-text">
                        {isCreateMode() ? "New Note" : title() || "Note"}
                        {!isSaved() && " *"}
                    </div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize" onClick={handleMinimize}></button>
                        <button aria-label="Maximize" onClick={handleMaximize}></button>
                        <button aria-label="Close" onClick={handleClose}></button>
                    </div>
                </div>
                <div class="window-body">
                    <Show when={!isCreateMode()} fallback={
                        <div class="note-create-mode">
                            <p>Creating new note from NotesWindow...</p>
                        </div>
                    }>
                        <div class="note-detail-form">
                            <div class="field-row">
                                <label for="note-title">Title:</label>
                                <input
                                    id="note-title"
                                    type="text"
                                    value={title()}
                                    onInput={(e) => handleTitleChange(e.currentTarget.value)}
                                    placeholder="Note title..."
                                />
                            </div>
                            <div class="field-row-stacked">
                                <label for="note-content">Content:</label>
                                <textarea
                                    id="note-content"
                                    rows={8}
                                    value={content()}
                                    onInput={(e) => handleContentChange(e.currentTarget.value)}
                                    placeholder="Write your note..."
                                />
                            </div>
                            <div class="button-row">
                                <button 
                                    class="default" 
                                    onClick={handleSave}
                                    disabled={isSaved() || !title().trim()}
                                >
                                    {isSaved() ? "Saved" : "Save"}
                                </button>
                                <button onClick={handleClose}>Close</button>
                            </div>
                        </div>
                    </Show>
                </div>
            </div>
        </Show>
    );
}
