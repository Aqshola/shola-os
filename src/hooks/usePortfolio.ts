import { createSignal } from "solid-js";

export function usePortfolio() {
    const [isOpen, setIsOpen] = createSignal(false);
    const [isMinimized, setIsMinimized] = createSignal(false);
    const [openProjectId, setOpenProjectId] = createSignal<string | null>(null);

    const open = () => {
        setIsOpen(true);
        setIsMinimized(false);
    };

    const close = () => {
        setIsOpen(false);
        setIsMinimized(false);
        setOpenProjectId(null);
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
    };

    const closeProject = () => {
        setOpenProjectId(null);
    };

    return {
        isOpen,
        isMinimized,
        isActive: () => isOpen() && !isMinimized(),
        openProjectId,
        open,
        close,
        minimize,
        restore,
        toggle,
        openProject,
        closeProject,
    };
}
