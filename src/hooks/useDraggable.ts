import { createSignal, onCleanup, JSX } from "solid-js";

interface Position {
  x: number;
  y: number;
}

export function useDraggable(initialPosition: Position = { x: 0, y: 0 }) {
  const [position, setPosition] = createSignal<Position>(initialPosition);
  const [isDragging, setIsDragging] = createSignal(false);
  const [offset, setOffset] = createSignal<Position>({ x: 0, y: 0 });

  const handleMouseDown: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if ((e.target as HTMLElement).closest(".title-bar-controls")) return;
    
    setIsDragging(true);
    setOffset({
      x: e.clientX - position().x,
      y: e.clientY - position().y,
    });

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging()) return;
      setPosition({
        x: moveEvent.clientX - offset().x,
        y: moveEvent.clientY - offset().y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return {
    position,
    isDragging,
    handleMouseDown,
  };
}
