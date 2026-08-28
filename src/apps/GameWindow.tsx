import { For, Show, createSignal } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex } from "@/stores/windowStore";
import "@/pages/Desktop/style/window.css";
import { GameItem } from "@/services/game";
import GamePlayerView from "@/components/game/GamePlayerView";

interface GameWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onRestore: () => void;
  hooks: any;
}

const WINDOW_ID = "game";

export default function GameWindow(props: GameWindowProps) {


  return (
    <Show when={props.isOpen}>
      <ContentGameWindow hooks={props.hooks} onClose={props.onClose} onMinimize={props.onMinimize} onRestore={props.onRestore} />
    </Show>
  );
}


interface PropsContentGameWindow {
  onClose: () => void;
  onMinimize: () => void;
  onRestore: () => void;
  hooks: any;
}
function ContentGameWindow(props: PropsContentGameWindow) {
  const [isMaximized, setIsMaximized] = createSignal(false);
  const defaultPosition = {
    x: Math.max(20, window.innerWidth / 2 - 200),
    y: Math.max(20, window.innerHeight / 2 - 80),
  };
  const draggable = useDraggable({ x: defaultPosition.x, y: defaultPosition.y });
  const gameHook = props.hooks;

  const handleClose = () => {
    gameHook.closePlayer();
    props.onClose();
  };

  const handleMinimize = () => props.onMinimize();
  const handleMaximize = () => setIsMaximized(!isMaximized());

  const handleTitleBarClick = () => {
    bringToFront(WINDOW_ID);
  };

  const handlePlayGame = (game: GameItem) => {
    gameHook.playGame(game);
  };

  return (
    <div
      class="window game-window"
      classList={{
        "window-maximized": isMaximized(),
        "in-game-mode": !!gameHook.selectedGame(),
      }}
      style={{
        position: isMaximized() ? "fixed" : "absolute",
        left: isMaximized() ? "0" : `${draggable.position().x}px`,
        top: isMaximized() ? "0" : `${draggable.position().y}px`,
        width: isMaximized() ? "100%" : undefined,
        height: isMaximized() ? "calc(100vh - 28px)" : undefined,
        "z-index": getZIndex(WINDOW_ID),
      }}
      onMouseDown={handleTitleBarClick}
    >
      <div
        class="title-bar"
        onMouseDown={!isMaximized() ? draggable.handleMouseDown : undefined}
      >
        <div class="title-bar-text">
          {gameHook.selectedGame()
            ? `🎮 ${gameHook.selectedGame()?.title} - Shola Arcade (NES)`
            : "🎮 Games - Shola Arcade"}
        </div>
        <div class="title-bar-controls">
          <button aria-label="Minimize" onClick={handleMinimize}></button>
          <button aria-label="Maximize" onClick={handleMaximize}></button>
          <button aria-label="Close" onClick={handleClose}></button>
        </div>
      </div>

      <div class="window-body game-window-body">
        <Show
          when={gameHook.selectedGame()}
          fallback={
            <div class="game-catalog-view">
              {/* Header banner / description */}
              <div class="game-header-banner">
                <div class="game-header-icon">🕹️</div>
                <div class="game-header-text">
                  <h3>8-Bit NES Arcade Showcase</h3>
                  <p>Select a game below to launch the retro emulator.</p>
                </div>
              </div>

              {/* Game List Grid */}
              <div class="game-list-container">
                <Show
                  when={!gameHook.loading()}
                  fallback={<div class="loading">Loading games catalog...</div>}
                >
                  <div class="game-grid">
                    <For each={gameHook.gameList() as GameItem[]}>
                      {(game) => (
                        <div class="game-showcase-card">
                          <div class="game-card-media">
                            <img
                              src={game.cover || "/assets/placeholder.png"}
                              alt={game.title}
                              class="game-card-cover"
                            />
                          </div>
                          <div class="game-card-content">
                            <div class="game-card-title-row">
                              <h4 class="game-card-title">{game.title}</h4>
                              <Show when={game.genre}>
                                <span class="game-card-genre-badge">{game.genre}</span>
                              </Show>
                            </div>
                            <Show when={game.releaseYear || game.developer}>
                              <p class="game-card-meta">
                                {game.releaseYear ? `Year: ${game.releaseYear}` : ""}
                                {game.releaseYear && game.developer ? " • " : ""}
                                {game.developer ? game.developer : ""}
                              </p>
                            </Show>
                            <Show when={game.description}>
                              <p class="game-card-description">{game.description}</p>
                            </Show>
                            <div class="game-card-actions">
                              <button
                                class="default play-btn"
                                onClick={() => handlePlayGame(game)}
                              >
                                ▶ Play Game
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              </div>

              {/* Controls Guide Section */}
              <div class="game-instructions-box">
                <fieldset>
                  <legend>NES Default Controls Guide</legend>
                  <div class="controls-legend-grid">
                    <div class="legend-row">
                      <span class="legend-key"><kbd>Arrow Keys</kbd></span>
                      <span class="legend-action">D-Pad (Move / Aim)</span>
                    </div>
                    <div class="legend-row">
                      <span class="legend-key"><kbd>Z</kbd></span>
                      <span class="legend-action">B Button (Shoot / Attack)</span>
                    </div>
                    <div class="legend-row">
                      <span class="legend-key"><kbd>X</kbd></span>
                      <span class="legend-action">A Button (Jump)</span>
                    </div>
                    <div class="legend-row">
                      <span class="legend-key"><kbd>A</kbd> / <kbd>S</kbd></span>
                      <span class="legend-action">Turbo B / Turbo A</span>
                    </div>
                    <div class="legend-row">
                      <span class="legend-key"><kbd>Enter</kbd></span>
                      <span class="legend-action">Start (Pause / Begin)</span>
                    </div>
                    <div class="legend-row">
                      <span class="legend-key"><kbd>Right Ctrl</kbd></span>
                      <span class="legend-action">Select</span>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          }
        >
          <GamePlayerView
            game={gameHook.selectedGame()!}
            onBack={() => gameHook.closePlayer()}
          />
        </Show>
      </div>

      <div class="status-bar">
        <Show
          when={gameHook.selectedGame()}
          fallback={
            <>
              <p class="status-bar-field">
                {gameHook.gameList().length} Game{gameHook.gameList().length === 1 ? "" : "s"} Available
              </p>
              <p class="status-bar-field">Ready</p>
            </>
          }
        >
          <p class="status-bar-field">{gameHook.selectedGame()?.title}</p>
          <p class="status-bar-field">JSNES Engine</p>
          <p class="status-bar-field">60 FPS</p>
        </Show>
      </div>
    </div>
  )
}
