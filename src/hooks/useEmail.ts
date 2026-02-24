import { createSignal } from "solid-js";

export function useEmail() {
    const [isOpen, setIsOpen] = createSignal(false);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const toggle = () => {
        setIsOpen(!isOpen());
    };

    return {
        isOpen,
        isActive: isOpen,
        open,
        close,
        toggle,
    };
}
