import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { getListNotes, createNote, updateNote, Note } from "@/services/notes";

export function useNotes() {
  const [state, setState] = makePersisted(
    createStore({
      isOpen: false,
      isMinimized: false,
      notes: [] as Note[],
      selectedNoteId: null as string | null,
    }),
    { name: "shola-os-notes-module" }
  );

  const [loading, setLoading] = createSignal(false);

  // Fetch all notes
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await getListNotes();
      setState({ notes: data });
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new note
  const createNewNote = async (title: string, content: string) => {
    setLoading(true);
    try {
      const newNote = await createNote(title, content);
      if (newNote) {
        setState("notes", (notes) => [newNote, ...notes]);
        return newNote;
      }
      return null;
    } catch (error) {
      console.error("Failed to create note:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update existing note
  const updateExistingNote = async (id: string, title: string, content: string) => {
    setLoading(true);
    try {
      const updatedNote = await updateNote(id, title, content);
      if (updatedNote) {
        setState("notes", (note) => note.id === id, updatedNote);
        return updatedNote;
      }
      return null;
    } catch (error) {
      console.error("Failed to update note:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Open a note (select it)
  const openNote = (id: string) => {
    setState({ selectedNoteId: id });
  };

  // Close the selected note
  const closeNote = () => {
    setState({ selectedNoteId: null });
  };

  const open = () => {
    setState({
      isOpen: true,
      isMinimized: false,
    });
    fetchNotes();
  };

  const close = () => {
    setState({
      isOpen: false,
      isMinimized: false,
      selectedNoteId: null,
    });
  };

  const minimize = () => {
    setState("isMinimized", true);
  };

  const restore = () => {
    setState({
      isMinimized: false,
      isOpen: true,
    });
  };

  const toggle = () => {
    if (state.isMinimized) {
      restore();
    } else if (state.isOpen) {
      minimize();
    } else {
      open();
    }
  };

  return {
    isOpen: () => state.isOpen,
    isMinimized: () => state.isMinimized,
    isActive: () => state.isOpen && !state.isMinimized,

    notes: () => state.notes,
    selectedNoteId: () => state.selectedNoteId,
    loading,

    fetchNotes,
    createNewNote,
    updateExistingNote,
    openNote,
    closeNote,

    open,
    close,
    minimize,
    restore,
    toggle,
  };
}
