import { createSignal } from "solid-js";

export type ShutdownType = "shutdown" | "restart";

export interface ShutdownState {
  isOpen: boolean;
  type: ShutdownType;
  onComplete: (() => void) | null;
}

const [shutdownState, setShutdownState] = createSignal<ShutdownState>({
  isOpen: false,
  type: "shutdown",
  onComplete: null,
});

const openShutdown = (type: ShutdownType, onComplete: () => void) => {
  setShutdownState({
    isOpen: true,
    type,
    onComplete,
  });
};

const closeShutdown = () => {
  setShutdownState({
    isOpen: false,
    type: "shutdown",
    onComplete: null,
  });
};

export { shutdownState, openShutdown, closeShutdown };
