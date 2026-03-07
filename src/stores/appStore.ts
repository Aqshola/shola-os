import { initializeStartApps, StartApp } from "@/module/start-module";
import { createSignal } from "solid-js";

const  [appStore, setAppStore] = createSignal<StartApp[]>([])

const initAppList = () => {
  const appList = initializeStartApps();
  setAppStore(appList.LIST_START_APP);
};

export {
    appStore,
    initAppList
}

