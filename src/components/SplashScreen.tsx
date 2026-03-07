import { createSignal, onMount, For, Show } from "solid-js";
import "./SplashScreen.css";

interface SplashScreenProps {
  onComplete: () => void;
}

const MESSAGES = [
  "Detecting hardware...",
  "Loading Aqshol OS...",
  "Starting desktop...",
];

export default function SplashScreen(props: SplashScreenProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = createSignal(0);
  const [displayedText, setDisplayedText] = createSignal("");
  const [progress, setProgress] = createSignal(0);
  const [isComplete, setIsComplete] = createSignal(false);

  onMount(() => {
    // Start typing effect
    typeMessage(0);
  });

  const typeMessage = (index: number) => {
    if (index >= MESSAGES.length) {
      // All messages shown, show "Starting Windows..." and complete
      setIsComplete(true);
      setTimeout(() => {
        props.onComplete();
      }, 1500);
      return;
    }

    setCurrentMessageIndex(index);
    setDisplayedText("");
    
    const message = MESSAGES[index];
    let charIndex = 0;

    const typeChar = () => {
      if (charIndex < message.length) {
        setDisplayedText(message.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typeChar, 30 + Math.random() * 50);
      } else {
        // Move to next message after a delay
        setTimeout(() => {
          // Random progress increment
          setProgress((p) => Math.min(p + 20 + Math.random() * 30, 100));
          typeMessage(index + 1);
        }, 500 + Math.random() * 500);
      }
    };

    typeChar();
  };

  return (
    <div class="splash-overlay">
      <div class="splash-window">
        <div class="splash-content">
          <div class="splash-logo">
            <img src="/assets/icons/SO_Logo.png" alt="Shola OS" />
          </div>
          <div class="splash-title">Shola OS</div>
          
          <Show when={!isComplete()} fallback={
            <div class="splash-starting">Starting Shola OS...</div>
          }>
            <div class="splash-message">
              {displayedText()}
              <span class="splash-cursor">_</span>
            </div>
          </Show>
          
          <div class="splash-progress-container">
            <div class="splash-progress-bar" style={{ width: `${progress()}%` }}></div>
          </div>
        </div>
        <div class="splash-footer">
          <span>Shola OS™</span>
          <span>Version 4.10.1998</span>
        </div>
      </div>
    </div>
  );
}
