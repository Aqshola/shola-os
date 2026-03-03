import { createSignal } from "solid-js";

export function usePortfolio() {
    const [isOpen, setIsOpen] = createSignal(false);
    const [isMinimized, setIsMinimized] = createSignal(false);
    const [openProjectId, setOpenProjectId] = createSignal<string | null>(null);
    const [isContentMinimized, setIsContentMinimized] = createSignal(false);

    const open = () => {
        setIsOpen(true);
        setIsMinimized(false);
    };

    const close = () => {
        setIsOpen(false);
        setIsMinimized(false);
        setOpenProjectId(null);
        setIsContentMinimized(false);
    };

    const minimize = () => {
        setIsMinimized(true);
    };

    const restore = () => {
        setIsMinimized(false);
        setIsOpen(true);
    };

    const toggle = () => {
        if (isMinimized()) {
            restore();
        } else if (isOpen()) {
            minimize();
        } else {
            open();
        }
    };

    const openProject = (id: string) => {
        setOpenProjectId(id);
        setIsContentMinimized(false);
    };

    const closeProject = () => {
        setOpenProjectId(null);
        setIsContentMinimized(false);
    };

    // Content window (project detail) minimize/restore
    const minimizeContent = () => {
        setIsContentMinimized(true);
    };

    const restoreContent = () => {
        setIsContentMinimized(false);
    };

    return {
        isOpen,
        isMinimized,
        isActive: () => isOpen() && !isMinimized(),
        openProjectId,
        isContentMinimized,
        isContentActive: () => openProjectId() !== null && !isContentMinimized(),
        open,
        close,
        minimize,
        restore,
        toggle,
        openProject,
        closeProject,
        minimizeContent,
        restoreContent,
    };
}
