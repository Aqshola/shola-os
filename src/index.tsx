/* @refresh reload */
import { render } from 'solid-js/web';
import { createSignal, Show } from 'solid-js';
import 'solid-devtools';

import { Route, Router } from '@solidjs/router';
import Desktop from './pages/Desktop';
import SplashScreen from './components/SplashScreen';
import  './style/index.css'
const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => {
  const [showSplash, setShowSplash] = createSignal(true);

  return (
    <Show when={!showSplash()} fallback={
      <SplashScreen onComplete={() => setShowSplash(false)} />
    }>
      <Router>
        <Route path={"/"} component={Desktop}/>
      </Router>
    </Show>
  );
}, root!);
