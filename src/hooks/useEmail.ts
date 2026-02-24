import { createSignal } from "solid-js";
import { AppWindow } from "./type";

export function useEmail(): AppWindow {
    const [isOpen, setIsOpen] = createSignal(false);
    const [isMinimized, setIsMinimized] = createSignal(false);

    const open = () => {
        setIsOpen(true);
        setIsMinimized(false);
    };

    const close = () => {
        setIsOpen(false);
        setIsMinimized(false);
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

    return {
        isOpen,
        isMinimized,
        isActive: () => isOpen() && !isMinimized(),
        open,
        close,
        minimize,
        restore,
        toggle,
    };
}
