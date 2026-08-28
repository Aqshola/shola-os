import { Show, createSignal, onMount, onCleanup, createEffect } from "solid-js";
import { Browser, Controller } from "jsnes";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex, registerWindow, unregisterWindow } from "@/stores/windowStore";
import { GameItem } from "@/services/game";
import "@/pages/Desktop/style/window.css";

interface GamePlayerWindowProps {
  game: GameItem | null;
  onClose: () => void;
  onMinimize: () => void;
  onRestore: () => void;
}

const WINDOW_ID_PREFIX = "game-player-";

export default function GamePlayerWindow(props: GamePlayerWindowProps) {
  const [isMaximized, setIsMaximized] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(true);
  const [loadingError, setLoadingError] = createSignal<string | null>(null);
  const [isPaused, setIsPaused] = createSignal(false);
  const [showVirtualPad, setShowVirtualPad] = createSignal(false);

  let containerRef: HTMLDivElement | undefined;
  let browserInstance: Browser | null = null;

  const windowId = () => (props.game ? WINDOW_ID_PREFIX + props.game.id : null);
  const defaultPosition = {
    x: Math.max(20, window.innerWidth / 2 - 270),
    y: Math.max(20, window.innerHeight / 2 - 50),
  };
  const draggable = useDraggable({ x: defaultPosition.x, y: defaultPosition.y });

  const cleanupEmulator = () => {
    if (browserInstance) {
      try {
        browserInstance.destroy();
      } catch (e) {
        console.error("Error destroying NES emulator:", e);
      }
      browserInstance = null;
    }
  };

  const initEmulator = (romUrl: string) => {
    cleanupEmulator();
    if (!containerRef) return;

    // // Clear previous canvas if any
    containerRef.innerHTML = "";
    setIsLoading(true);
    setLoadingError(null);
    setIsPaused(false);

    Browser.loadROMFromURL(romUrl, (error, data) => {
      console.log(romUrl,error)
      if (error || !data) {
        setIsLoading(false);
        setLoadingError(error?.message || "Failed to load NES ROM file.");
        return;
      }

      try {
        if (!containerRef) return;
        const browser = new Browser({
          container: containerRef,
          romData: data,
          onError: (err) => {
            console.error("JSNES runtime error:", err);
            setLoadingError("Emulator Error: " + err.message);
          },
        });
        browserInstance = browser;
        setIsLoading(false);
      } catch (e: any) {
        console.error("Error creating NES browser instance:", e);
        setIsLoading(false);
        setLoadingError(e?.message || "Failed to initialize NES emulator.");
      }
    });
  };

  createEffect(() => {
    const currentGame = props.game;
    if (currentGame && currentGame.romUrl) {
      initEmulator(currentGame.romUrl);
    } else {
      cleanupEmulator();
    }
  });

  onCleanup(() => {
    const id = windowId();
    if (id) unregisterWindow(id);
    cleanupEmulator();
  });

  const handleClose = () => {
    cleanupEmulator();
    props.onClose();
  };

  const handleMinimize = () => {
    if (browserInstance && !isPaused()) {
      browserInstance.stop();
      setIsPaused(true);
    }
    props.onMinimize();
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized());
    if (browserInstance) {
      setTimeout(() => {
        browserInstance?.fitInParent();
      }, 50);
    }
  };

  const handleTitleBarClick = () => {
    const id = windowId();
    if (id) bringToFront(id);
  };

  const handleTogglePause = () => {
    if (!browserInstance) return;
    if (isPaused()) {
      browserInstance.start();
      setIsPaused(false);
    } else {
      browserInstance.stop();
      setIsPaused(true);
    }
  };

  const handleReset = () => {
    if (browserInstance) {
      browserInstance.nes.reloadROM();
      if (isPaused()) {
        browserInstance.start();
        setIsPaused(false);
      }
    }
  };

  // Virtual Gamepad button handlers
  const handleButtonDown = (button: number) => {
    if (browserInstance) {
      browserInstance.nes.buttonDown(1, button as any);
    }
  };

  const handleButtonUp = (button: number) => {
    if (browserInstance) {
      browserInstance.nes.buttonUp(1, button as any);
    }
  };

  return (
      <div
        class="window game-emulator-window"
        classList={{ "window-maximized": isMaximized() }}
        style={{
          position: isMaximized() ? "fixed" : "absolute",
          left: isMaximized() ? "0" : `${draggable.position().x}px`,
          top: isMaximized() ? "0" : `${draggable.position().y}px`,
          "z-index": getZIndex(windowId()!),
        }}
        onMouseDown={handleTitleBarClick}
      >
        <div
          class="title-bar"
          onMouseDown={!isMaximized() ? draggable.handleMouseDown : undefined}
        >
          <div class="title-bar-text">
            🎮 {props.game?.title || "NES Emulator"} - JSNES 8-Bit
          </div>
          <div class="title-bar-controls">
            <button aria-label="Minimize" onClick={handleMinimize}></button>
            <button aria-label="Maximize" onClick={handleMaximize}></button>
            <button aria-label="Close" onClick={handleClose}></button>
          </div>
        </div>

        <div class="window-body game-player-body">
          {/* Emulator Top Toolbar */}
          <div class="emulator-toolbar">
            <div class="emulator-toolbar-group">
              <button onClick={handleTogglePause} disabled={isLoading() || !!loadingError()}>
                {isPaused() ? "▶ Resume" : "⏸ Pause"}
              </button>
              <button onClick={handleReset} disabled={isLoading() || !!loadingError()}>
                🔄 Reset
              </button>
              <button
                onClick={() => setShowVirtualPad(!showVirtualPad())}
                class={showVirtualPad() ? "active" : ""}
              >
                🎮 {showVirtualPad() ? "Hide Controls" : "Touch Controls"}
              </button>
            </div>
            <div class="emulator-status-pill">
              <Show when={isLoading()}>
                <span class="status-loading">Loading ROM...</span>
              </Show>
              <Show when={!isLoading() && !loadingError()}>
              </Show>
              <Show when={loadingError()}>
                <span class="status-error">Error</span>
              </Show>
            </div>
          </div>

          {/* Screen Canvas Area */}
          <div class="emulator-screen-wrapper">
            <Show when={loadingError()}>
              <div class="emulator-error-box">
                <p><strong>Failed to load game:</strong></p>
                <p>{loadingError()}</p>
                <button onClick={() => props.game && initEmulator(props.game.romUrl)}>Retry</button>
              </div>
            </Show>

            <Show when={isLoading() && !loadingError()}>
              <div class="emulator-loading-box">
                <div class="loading-spinner"></div>
                <p>Loading {props.game?.title} ROM...</p>
                <small>Please wait while the NES engine starts.</small>
              </div>
            </Show>

            <div
              ref={containerRef}
              class="emulator-screen-container"
            />
          </div>

          {/* Virtual On-Screen Gamepad */}
          <Show when={showVirtualPad()}>
            <div class="virtual-gamepad-container">
              {/* D-Pad */}
              <div class="dpad-container">
                <div class="dpad-row">
                  <button
                    class="dpad-btn dpad-up"
                    onMouseDown={() => handleButtonDown(Controller.BUTTON_UP)}
                    onMouseUp={() => handleButtonUp(Controller.BUTTON_UP)}
                    onTouchStart={(e) => { e.preventDefault(); handleButtonDown(Controller.BUTTON_UP); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleButtonUp(Controller.BUTTON_UP); }}
                  >
                    ▲
                  </button>
                </div>
                <div class="dpad-row dpad-middle">
                  <button
                    class="dpad-btn dpad-left"
                    onMouseDown={() => handleButtonDown(Controller.BUTTON_LEFT)}
                    onMouseUp={() => handleButtonUp(Controller.BUTTON_LEFT)}
                    onTouchStart={(e) => { e.preventDefault(); handleButtonDown(Controller.BUTTON_LEFT); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleButtonUp(Controller.BUTTON_LEFT); }}
                  >
                    ◀
                  </button>
                  <div class="dpad-center"></div>
                  <button
                    class="dpad-btn dpad-right"
                    onMouseDown={() => handleButtonDown(Controller.BUTTON_RIGHT)}
                    onMouseUp={() => handleButtonUp(Controller.BUTTON_RIGHT)}
                    onTouchStart={(e) => { e.preventDefault(); handleButtonDown(Controller.BUTTON_RIGHT); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleButtonUp(Controller.BUTTON_RIGHT); }}
                  >
                    ▶
                  </button>
                </div>
                <div class="dpad-row">
                  <button
                    class="dpad-btn dpad-down"
                    onMouseDown={() => handleButtonDown(Controller.BUTTON_DOWN)}
                    onMouseUp={() => handleButtonUp(Controller.BUTTON_DOWN)}
                    onTouchStart={(e) => { e.preventDefault(); handleButtonDown(Controller.BUTTON_DOWN); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleButtonUp(Controller.BUTTON_DOWN); }}
                  >
                    ▼
                  </button>
                </div>
              </div>

              {/* Middle Select/Start */}
              <div class="gamepad-middle-buttons">
                <div class="pill-btn-group">
                  <button
                    class="pill-btn"
                    onMouseDown={() => handleButtonDown(Controller.BUTTON_SELECT)}
                    onMouseUp={() => handleButtonUp(Controller.BUTTON_SELECT)}
                    onTouchStart={(e) => { e.preventDefault(); handleButtonDown(Controller.BUTTON_SELECT); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleButtonUp(Controller.BUTTON_SELECT); }}
                  >
                    SELECT
                  </button>
                  <button
                    class="pill-btn"
                    onMouseDown={() => handleButtonDown(Controller.BUTTON_START)}
                    onMouseUp={() => handleButtonUp(Controller.BUTTON_START)}
                    onTouchStart={(e) => { e.preventDefault(); handleButtonDown(Controller.BUTTON_START); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleButtonUp(Controller.BUTTON_START); }}
                  >
                    START
                  </button>
                </div>
              </div>

              {/* Action Buttons A & B & Turbo */}
              <div class="action-buttons-container">
                <div class="action-row">
                  <button
                    class="action-btn turbo-btn"
                    onMouseDown={() => handleButtonDown(Controller.BUTTON_TURBO_B)}
                    onMouseUp={() => handleButtonUp(Controller.BUTTON_TURBO_B)}
                    onTouchStart={(e) => { e.preventDefault(); handleButtonDown(Controller.BUTTON_TURBO_B); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleButtonUp(Controller.BUTTON_TURBO_B); }}
                  >
                    TB
                  </button>
                  <button
                    class="action-btn turbo-btn"
                    onMouseDown={() => handleButtonDown(Controller.BUTTON_TURBO_A)}
                    onMouseUp={() => handleButtonUp(Controller.BUTTON_TURBO_A)}
                    onTouchStart={(e) => { e.preventDefault(); handleButtonDown(Controller.BUTTON_TURBO_A); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleButtonUp(Controller.BUTTON_TURBO_A); }}
                  >
                    TA
                  </button>
                </div>
                <div class="action-row">
                  <button
                    class="action-btn"
                    onMouseDown={() => handleButtonDown(Controller.BUTTON_B)}
                    onMouseUp={() => handleButtonUp(Controller.BUTTON_B)}
                    onTouchStart={(e) => { e.preventDefault(); handleButtonDown(Controller.BUTTON_B); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleButtonUp(Controller.BUTTON_B); }}
                  >
                    B
                  </button>
                  <button
                    class="action-btn"
                    onMouseDown={() => handleButtonDown(Controller.BUTTON_A)}
                    onMouseUp={() => handleButtonUp(Controller.BUTTON_A)}
                    onTouchStart={(e) => { e.preventDefault(); handleButtonDown(Controller.BUTTON_A); }}
                    onTouchEnd={(e) => { e.preventDefault(); handleButtonUp(Controller.BUTTON_A); }}
                  >
                    A
                  </button>
                </div>
              </div>
            </div>
          </Show>

          {/* Bottom Keyboard Controls Hint */}
          <div class="emulator-controls-hint">
            <span class="hint-title">Controls:</span>
            <span class="hint-item"><kbd>Arrows</kbd> Move</span>
            <span class="hint-item"><kbd>Z</kbd> B (Fire)</span>
            <span class="hint-item"><kbd>X</kbd> A (Jump)</span>
            <span class="hint-item"><kbd>A</kbd>/<kbd>S</kbd> Turbo</span>
            <span class="hint-item"><kbd>Enter</kbd> Start</span>
            <span class="hint-item"><kbd>R-Ctrl</kbd> Select</span>
          </div>
        </div>

        <div class="status-bar">
          <p class="status-bar-field">{props.game?.title}</p>
          <p class="status-bar-field">JSNES Engine</p>
          <p class="status-bar-field">60 FPS</p>
        </div>
      </div>
  );
}
