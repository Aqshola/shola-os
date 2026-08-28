import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { GameItem, getListGames } from "@/services/game";
import { AppWindow } from "./type";

export function useGame(): AppWindow & {
  selectedGame: () => GameItem | null;
  selectedGameId: () => string | null;
  isGameRunning: () => boolean;
  gameList: () => GameItem[];
  loading: () => boolean;
  fetchGames: () => Promise<void>;
  playGame: (game: GameItem) => void;
  closePlayer: () => void;
} {
  const [state, setState] = makePersisted(
    createStore({
      isOpen: false,
      isMinimized: false,
      selectedGameId: null as string | null,
      gameList: [] as GameItem[],
      selectedGame: null as GameItem | null,
    }),
    { name: "shola-os-game-module" }
  );

  const [loading, setLoading] = createSignal(false);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const data = await getListGames();
      setState({ gameList: data });
    } catch (error) {
      console.error("Failed to fetch game list:", error);
    } finally {
      setLoading(false);
    }
  };

  const open = () => {
    setState({
      isOpen: true,
      isMinimized: false,
    });
    fetchGames();
  };

  const close = () => {
    setState({
      isOpen: false,
      isMinimized: false,
      selectedGameId: null,
      selectedGame: null,
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

  const playGame = (game: GameItem) => {
    setState({
      selectedGameId: game.id,
      selectedGame: game,
    });
  };

  const closePlayer = () => {
    setState({
      selectedGameId: null,
      selectedGame: null,
    });
  };

  return {
    isOpen: () => state.isOpen,
    isMinimized: () => state.isMinimized,
    isActive: () => state.isOpen && !state.isMinimized,

    selectedGame: () => state.selectedGame,
    selectedGameId: () => state.selectedGameId,
    isGameRunning: () => state.selectedGameId !== null,

    gameList: () => state.gameList,
    loading,

    open,
    close,
    minimize,
    restore,
    toggle,
    fetchGames,
    playGame,
    closePlayer,
  };
}
