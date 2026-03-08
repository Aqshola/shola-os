/* @refresh reload */
import { render } from 'solid-js/web';
import { createSignal, Show } from 'solid-js';
import 'solid-devtools';

import { Route, Router } from '@solidjs/router';
import Desktop from './pages/Desktop';
import SplashScreen from './components/SplashScreen';
import  './style/index.css'
import { loadFromLocalStorage, saveToLocalStorage } from './lib/localstorage';
import { initAppList } from './stores/appStore';
import { initPocketBase } from './lib/pocketbase';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => {
  initPocketBase()
  initAppList()
  const isAlreadyLoaded= loadFromLocalStorage("SHOLA_OS_LOADED") === "true";
  const [showSplash, setShowSplash] = createSignal(isAlreadyLoaded ? false : true);

  return (
    <Show when={!showSplash()} fallback={
      <SplashScreen onComplete={() => {
        setShowSplash(false)
        saveToLocalStorage("SHOLA_OS_LOADED", "true")
      }
      } />
    }>
      <Router>
        <Route path={"/"} component={Desktop}/>
      </Router>
    </Show>
  );
}, root!);
