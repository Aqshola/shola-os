/* @refresh reload */
import { render } from 'solid-js/web';
import { createSignal, Show, lazy } from 'solid-js';
import 'solid-devtools';

import { Route, Router } from '@solidjs/router';
import Desktop from './pages/Desktop';
import SplashScreen from './components/SplashScreen';
import './style/index.css';
import { loadFromLocalStorage, saveToLocalStorage } from './lib/localstorage';
import { initAppList } from './stores/appStore';
import { initSocial } from './stores/socialStore';

const BlogsPage = lazy(() => import('./pages/Blogs'));
const BlogPostDetailPage = lazy(() => import('./pages/Blogs/PostDetail'));

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => {
  initSocial();
  initAppList();
  const isAlreadyLoaded = loadFromLocalStorage("SHOLA_OS_LOADED") === "true";
  const isDirectBlogRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/blog');
  const [showSplash, setShowSplash] = createSignal(isAlreadyLoaded || isDirectBlogRoute ? false : true);

  const getAppFromParam = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("app_name");
  };

  const getBlogSlugFromParam = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("blog_slug");
  };

  // Store app_name and blog_slug for Desktop to use
  if (typeof window !== 'undefined') {
    window.__APP_NAME__ = getAppFromParam();
    window.__BLOG_SLUG__ = getBlogSlugFromParam();
  }

  return (
    <Show when={!showSplash()} fallback={
      <SplashScreen onComplete={() => {
        setShowSplash(false);
        saveToLocalStorage("SHOLA_OS_LOADED", "true");
      }} />
    }>
      <Router>
        <Route path="/" component={() => <Desktop appName={getAppFromParam()} blogSlug={getBlogSlugFromParam()} />} />
        <Route path="/blogs" component={BlogsPage} />
        <Route path="/blog/:slug" component={BlogPostDetailPage} />
        <Route path="/blogs/:slug" component={BlogPostDetailPage} />
      </Router>
    </Show>
  );
}, root!);