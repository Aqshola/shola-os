import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { AppWindow } from "@/hooks/type";
import { getBio, Bio } from "@/services/bio";

export function useAboutMe(): AppWindow & {
  bio: () => Bio | undefined;
  loading: () => boolean;
  fetchBio: () => Promise<void>;
} {
  const [state, setState] = makePersisted(
    createStore({
      isOpen: false,
      isMinimized: false,
    }),
    { name: "shola-os-about-me-module" }
  );

  const [bio, setBio] = createSignal<Bio | undefined>(undefined);
  const [loading, setLoading] = createSignal(false);

  const fetchBio = async () => {
    setLoading(true);
    try {
      const bioData = await getBio();
      setBio(bioData);
    } catch (error) {
      console.error("Failed to fetch bio:", error);
    } finally {
      setLoading(false);
    }
  };

  const open = () => {
    setState({
      isOpen: true,
      isMinimized: false,
    });
    fetchBio();
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
    fetchBio();
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
    bio,
    loading,
    fetchBio,
  };
}
