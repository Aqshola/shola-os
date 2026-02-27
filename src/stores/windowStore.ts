import { createStore } from "solid-js/store";

export const [windowStore, setWindowStore] = createStore({
  order: [] as string[],
  activeId: null as string | null,
});

export const bringToFront = (id: string) => {
  setWindowStore("order", (prev) => [...prev.filter((w) => w !== id), id]);
  setWindowStore("activeId", id);
};

export const getZIndex = (id: string) => {
  const idx = windowStore.order.indexOf(id);
  return idx >= 0 ? 10001 + idx : 10000;
};

export const registerWindow = (id: string) => {
  if (!windowStore.order.includes(id)) {
    setWindowStore("order", (prev) => [...prev, id]);
  }
};

export const unregisterWindow = (id: string) => {
  setWindowStore("order", (prev) => prev.filter((w) => w !== id));
};
