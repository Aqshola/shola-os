import { createEffect, onMount, Show } from "solid-js";
import "./ShutdownScreen.css";

export type ShutdownType = "shutdown" | "restart";

interface ShutdownScreenProps {
  isOpen: boolean;
  type: ShutdownType;
  onComplete: () => void;
}

export default function ShutdownScreen(props: ShutdownScreenProps) {
  let timeoutId: number | undefined;

  onMount(() => {
    // Cleanup on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  });

  createEffect(() => {
    if (props.isOpen) {
      // Wait 2-3 seconds then call onComplete
      timeoutId = window.setTimeout(() => {
        props.onComplete();
      }, 2500);
    }
  });

  return (
    <Show when={props.isOpen}>
      <div class="shutdown-overlay">
        <div class="shutdown-window">
          <div class="shutdown-content">
            <div class="shutdown-icon">
              <img src="/assets/icons/shutdown.svg" alt="Shutdown" />
            </div>
            <div class="shutdown-message">
              {props.type === "shutdown"
                ? "Windows is shutting down..."
                : "Windows is restarting..."}
            </div>
            <div class="shutdown-progress">
              <div class="shutdown-dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}
