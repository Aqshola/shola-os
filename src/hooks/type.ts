import { Accessor } from "solid-js";

export interface AppWindow {
    isOpen: Accessor<boolean>;
    isMinimized: Accessor<boolean>;
    isActive: () => boolean;
    open: () => void;
    close: () => void;
    minimize: () => void;
    restore: () => void;
    toggle: () => void;
}