import { For, Show, createSignal } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex, registerWindow, unregisterWindow } from "@/stores/windowStore";
import "@/pages/Desktop/style/window.css";
import NoteWindow from "./NoteWindow";
import { Note } from "@/services/notes";

interface NotesWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
    hooks: any;
}

const WINDOW_ID = "notes";

export default function NotesWindow(props: NotesWindowProps) {
    const [isMaximized, setIsMaximized] = createSignal(false);
    const [showCreateModal, setShowCreateModal] = createSignal(false);
    const [newNoteTitle, setNewNoteTitle] = createSignal("");
    const [newNoteContent, setNewNoteContent] = createSignal("");

    const defaultPosition = { x: window.innerWidth / 2 - 200, y: (window.innerHeight / 2) - 150 };
    const draggable = useDraggable({ x: defaultPosition.x, y: defaultPosition.y });

    const notes = props.hooks;

    const handleClose = () => {
        notes.closeNote();
        props.onClose();
    };

    const handleMinimize = () => props.onMinimize();
    const handleMaximize = () => setIsMaximized(!isMaximized());

    const handleTitleBarClick = () => {
        bringToFront(WINDOW_ID);
    };

    const handleCreateNote = async () => {
        if (!newNoteTitle().trim()) return;
        
        const newNote = await notes.createNewNote(newNoteTitle(), newNoteContent());
        if (newNote) {
            notes.openNote(newNote.id);
            registerWindow(`note-${newNote.id}`);
        }
        
        setShowCreateModal(false);
        setNewNoteTitle("");
        setNewNoteContent("");
    };

    const handleNoteClick = (note: Note) => {
        notes.openNote(note.id);
        registerWindow(`note-${note.id}`);
    };

    return (
        <>
            <Show when={props.isOpen}>
                <div
                    class="window notes-window"
                    classList={{ "window-maximized": isMaximized() }}
                    style={{
                        position: isMaximized() ? "fixed" : "absolute",
                        left: isMaximized() ? "0" : `${draggable.position().x}px`,
                        top: isMaximized() ? "0" : `${draggable.position().y}px`,
                        width: isMaximized() ? "100%" : "400px",
                        height: isMaximized() ? "calc(100vh - 28px)" : "350px",
                        "z-index": getZIndex(WINDOW_ID),
                    }}
                    onMouseDown={handleTitleBarClick}
                >
                    <div
                        class="title-bar"
                        onMouseDown={!isMaximized() ? draggable.handleMouseDown : undefined}
                    >
                        <div class="title-bar-text">Notepad</div>
                        <div class="title-bar-controls">
                            <button aria-label="Minimize" onClick={handleMinimize}></button>
                            <button aria-label="Maximize" onClick={handleMaximize}></button>
                            <button aria-label="Close" onClick={handleClose}></button>
                        </div>
                    </div>
                    <div class="window-body notes-content">
                        <div class="notes-header">
                            <button class="default" onClick={() => setShowCreateModal(true)}>
                                + Create Note
                            </button>
                        </div>

                        <Show when={showCreateModal()}>
                            <div class="notes-create-form">
                                <div class="field-row">
                                    <label for="new-note-title">Title:</label>
                                    <input
                                        id="new-note-title"
                                        type="text"
                                        value={newNoteTitle()}
                                        onInput={(e) => setNewNoteTitle(e.currentTarget.value)}
                                        placeholder="Note title..."
                                    />
                                </div>
                                <div class="field-row-stacked">
                                    <label for="new-note-content">Content:</label>
                                    <textarea
                                        id="new-note-content"
                                        rows={4}
                                        value={newNoteContent()}
                                        onInput={(e) => setNewNoteContent(e.currentTarget.value)}
                                        placeholder="Write your note..."
                                    />
                                </div>
                                <div class="button-row">
                                    <button class="default" onClick={handleCreateNote}>Save</button>
                                    <button onClick={() => setShowCreateModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </Show>

                        <div class="notes-list">
                            <Show when={notes.loading()} fallback={
                                <For each={notes.notes()}>{(note) => (
                                    <div
                                        class="note-item"
                                        onClick={() => handleNoteClick(note)}
                                    >
                                        <img src="/assets/icons/note.png" alt="" class="note-icon" />
                                        <div class="note-info">
                                            <span class="note-title">{note.title}</span>
                                            <span class="note-preview">
                                                {note.content.substring(0, 50)}
                                                {note.content.length > 50 ? "..." : ""}
                                            </span>
                                        </div>
                                    </div>
                                )}</For>
                            }>
                                <div class="loading">Loading notes...</div>
                            </Show>
                            <Show when={notes.notes().length === 0 && !notes.loading()}>
                                <div class="no-notes">No notes yet. Click "Create Note" to add one.</div>
                            </Show>
                        </div>
                    </div>
                </div>

                <NoteWindow
                    noteId={notes.selectedNoteId()}
                    onClose={() => {
                        notes.closeNote();
                    }}
                    onMinimize={() => handleMinimize()}
                    onRestore={() => {}}
                    hooks={notes}
                />
            </Show>
        </>
    );
}
