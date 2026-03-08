import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { getListPortofolio, getDetailPortofolio, Portfolio } from "@/services/portofolio";

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

  // Signals for portfolio data
  const [portfolioList, setPortfolioList] = createSignal<Portfolio[]>([]);
  const [selectedProject, setSelectedProject] = createSignal<Portfolio | null>(null);
  const [loading, setLoading] = createSignal(false);

  // Fetch portfolio list
  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const data = await getListPortofolio();
      setPortfolioList(data);
    } catch (error) {
      console.error("Failed to fetch portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch project detail
  const fetchProjectDetail = async (id: string) => {
    setLoading(true);
    try {
      const data = await getDetailPortofolio(id);
      setSelectedProject(data);
    } catch (error) {
      console.error("Failed to fetch project detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const open = () => {
    setState({
      isOpen: true,
      isMinimized: false,
    });
    // Load portfolio list when opening
    fetchPortfolio();
  };

  const close = () => {
    setState({
      isOpen: false,
      isMinimized: false,
      openProjectId: null,
      isContentMinimized: false,
    });
    setSelectedProject(null);
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
    // Fetch project detail when opening project
    fetchProjectDetail(id);
  };

  const closeProject = () => {
    setState({
      openProjectId: null,
      isContentMinimized: false,
    });
    setSelectedProject(null);
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

    // Expose signals
    portfolioList,
    selectedProject,
    loading,

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
