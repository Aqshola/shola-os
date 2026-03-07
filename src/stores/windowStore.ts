import { initializeStartApps, StartApp } from "@/module/start-module";
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";

// Persistable state using makePersisted
const [persistedStore] = makePersisted(
  createStore({
    order: [] as string[],
    activeId: null as string | null,
    activeWindows: [] as StartApp[],
  }),
  { name: "shola-os-window-store" }
);

// Non-persisted state using regular createStore
export const [windowStore, setWindowStore] = createStore({
  ...persistedStore,
  appList: [] as StartApp[],
});

// Sync persisted store changes to windowStore wrapper
export const bringToFront = (id: string) => {
  const newOrder = [...windowStore.order.filter((w) => w !== id), id];
  setWindowStore("order", newOrder);
  persistedStore.order = newOrder;
  setWindowStore("activeId", id);
  persistedStore.activeId = id;
};

export const getZIndex = (id: string) => {
  const idx = windowStore.order.indexOf(id);
  return idx >= 0 ? 10001 + idx : 10000;
};

export const registerWindow = (id: string) => {
  let newOrder: string[];
  if (!windowStore.order.includes(id)) {
    newOrder = [...windowStore.order, id];
  } else {
    newOrder = [...windowStore.order.filter((item) => item != id), id];
  }
  setWindowStore("order", newOrder);
  persistedStore.order = newOrder;
};

export const unregisterWindow = (id: string) => {
  const newOrder = windowStore.order.filter((w) => w !== id);
  setWindowStore("order", newOrder);
  persistedStore.order = newOrder;
};

export const addActiveWindow = (app: StartApp) => {
  if (!windowStore.activeWindows.some((w) => w.id === app.id)) {
    const newActiveWindows = [...windowStore.activeWindows, app];
    setWindowStore("activeWindows", newActiveWindows);
    persistedStore.activeWindows = newActiveWindows;
  }
};

export const removeActiveWindow = (app: StartApp) => {
  const newActiveWindows = windowStore.activeWindows.filter((w) => w.id !== app.id);
  setWindowStore("activeWindows", newActiveWindows);
  persistedStore.activeWindows = newActiveWindows;
};

export const initAppList = () => {
  const appList = initializeStartApps();
  setWindowStore("appList", appList.LIST_START_APP);
};
