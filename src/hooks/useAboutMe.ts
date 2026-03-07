import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { AppWindow } from "@/hooks/type";

export function useAboutMe(): AppWindow {
  const [state, setState] = makePersisted(
    createStore({
      isOpen: false,
      isMinimized: false,
    }),
    { name: "shola-os-about-me-module" }
  );

  const open = () => {
    setState({
      isOpen: true,
      isMinimized: false,
    });
  };

  const close = () => {
    setState({
      isOpen: false,
      isMinimized: false,
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
    open,
    close,
    minimize,
    restore,
    toggle,
  };
}