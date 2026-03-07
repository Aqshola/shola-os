import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";

export function usePortfolio() {
  const [state, setState] = makePersisted(
    createStore({
      isOpen: false,
      isMinimized: false,
      openProjectId: null as string | null,
      isContentMinimized: false,
    }),
    { name: "shola-os-portfolio-module" }
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
      openProjectId: null,
      isContentMinimized: false,
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

  const openProject = (id: string) => {
    setState({
      openProjectId: id,
      isContentMinimized: false,
    });
  };

  const closeProject = () => {
    setState({
      openProjectId: null,
      isContentMinimized: false,
    });
  };

  const minimizeContent = () => {
    setState("isContentMinimized", true);
  };

  const restoreContent = () => {
    setState("isContentMinimized", false);
  };

  return {
    isOpen: () => state.isOpen,
    isMinimized: () => state.isMinimized,
    isActive: () => state.isOpen && !state.isMinimized,

    openProjectId: () => state.openProjectId,
    isContentMinimized: () => state.isContentMinimized,
    isContentActive: () =>
      state.openProjectId !== null && !state.isContentMinimized,

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