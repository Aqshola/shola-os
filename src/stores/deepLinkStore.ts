import { createSignal } from "solid-js";

const [currentAppName, setCurrentAppName] = createSignal<string | null>(null);
const [blogSlug, setBlogSlugSignal] = createSignal<string | null>(null);

export function setCurrentApp(appName: string) {
    setCurrentAppName(appName);
    const url = new URL(window.location.href);
    url.searchParams.set("app_name", appName);
    window.history.replaceState({}, "", url.toString());
}

export function setBlogSlug(slug: string) {
    setBlogSlugSignal(slug);
    const url = new URL(window.location.href);
    url.searchParams.set("blog_slug", slug);
    window.history.replaceState({}, "", url.toString());
}

export function getAppFromParam(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get("app_name");
}

export function getBlogSlugFromParam(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get("blog_slug");
}

export { currentAppName, blogSlug };