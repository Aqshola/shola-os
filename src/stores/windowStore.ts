import { initializeStartApps, StartApp } from "@/module/start-module";
import { createStore } from "solid-js/store";

export const [windowStore, setWindowStore] = createStore({
  order: [] as string[],
  activeId: null as string | null,
  activeWindows: [] as StartApp[],
  appList: [] as StartApp[],
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
  } else {
    setWindowStore("order", (prev) => [
      ...prev.filter((item) => item != id),
      id,
    ]);
  }
};

export const unregisterWindow = (id: string) => {
  setWindowStore("order", (prev) => prev.filter((w) => w !== id));
};

export const addActiveWindow = (app: StartApp) => {
  if (!windowStore.activeWindows.some((w) => w.id === app.id)) {
    setWindowStore("activeWindows", (prev) => [...prev, app]);
  }
}

export const removeActiveWindow = (app: StartApp) => {
  setWindowStore("activeWindows", (prev) => prev.filter((w) => w.id !== app.id));
}

export const initAppList=()=>{
  const appList=initializeStartApps()
  setWindowStore("appList", appList.LIST_START_APP);
}
