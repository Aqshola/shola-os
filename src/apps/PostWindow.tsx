import { Show, createSignal, createEffect, onCleanup } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex, registerWindow, unregisterWindow } from "@/stores/windowStore";
import "@/pages/Desktop/style/window.css";
import { getPostBySlug, BlogPost } from "@/services/blog";

interface PostWindowProps {
    postSlug: string | null;
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
    hooks: any;
}

const WINDOW_ID_PREFIX = "post-";

export default function PostWindow(props: PostWindowProps) {
    const [isMaximized, setIsMaximized] = createSignal(false);
    const [post, setPost] = createSignal<BlogPost | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    const defaultPosition = { x: window.innerWidth / 2 - 200, y: (window.innerHeight / 2) - 175 };
    const draggable = useDraggable({ x: defaultPosition.x, y: defaultPosition.y });

    createEffect(async () => {
        const slug = props.postSlug;
        if (!slug) {
            setPost(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await getPostBySlug(slug);
            if (result) {
                setPost(result);
                registerWindow(`${WINDOW_ID_PREFIX}${slug}`);
            } else {
                setError("Post not found");
            }
        } catch (e) {
            setError("Failed to load post");
        } finally {
            setLoading(false);
        }
    });

    onCleanup(() => {
        if (props.postSlug) {
            unregisterWindow(`${WINDOW_ID_PREFIX}${props.postSlug}`);
        }
    });

    const handleClose = () => {
        props.onClose();
        if (props.postSlug) {
            unregisterWindow(`${WINDOW_ID_PREFIX}${props.postSlug}`);
        }
    };

    const handleMinimize = () => props.onMinimize();
    const handleMaximize = () => setIsMaximized(!isMaximized());

    const handleTitleBarClick = () => {
        if (props.postSlug) {
            bringToFront(`${WINDOW_ID_PREFIX}${props.postSlug}`);
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <Show when={props.postSlug}>
            <div
                class="window post-detail-window"
                classList={{ "window-maximized": isMaximized() }}
                style={{
                    position: isMaximized() ? "fixed" : "absolute",
                    left: isMaximized() ? "0" : `${draggable.position().x}px`,
                    top: isMaximized() ? "0" : `${draggable.position().y}px`,
                    width: isMaximized() ? "100%" : "400px",
                    height: isMaximized() ? "calc(100vh - 28px)" : "350px",
                    "z-index": getZIndex(`${WINDOW_ID_PREFIX}${props.postSlug}`),
                }}
                onMouseDown={handleTitleBarClick}
            >
                <div
                    class="title-bar"
                    onMouseDown={!isMaximized() ? draggable.handleMouseDown : undefined}
                >
                    <div class="title-bar-text">{post()?.title || "Blog Post"}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize" onClick={handleMinimize}></button>
                        <button aria-label="Maximize" onClick={handleMaximize}></button>
                        <button aria-label="Close" onClick={handleClose}></button>
                    </div>
                </div>
                <div class="window-body post-content">
                    <Show when={loading()}>
                        <div class="loading">Loading post...</div>
                    </Show>
                    <Show when={error()}>
                        <div class="error">{error()}</div>
                    </Show>
                    <Show when={post()}>
                        <article class="post-article">
                            <Show when={post()!.thumbnail}>
                                <img src={post()!.thumbnail} alt="" class="post-thumbnail" />
                            </Show>
                            <div class="post-meta">
                                <span class="post-author">By {post()!.author}</span>
                                <span class="post-date">{formatDate(post()!.created)}</span>
                            </div>
                            <h1 class="post-title">{post()!.title}</h1>
                            <div class="post-body" innerHTML={post()!.content} />
                        </article>
                    </Show>
                </div>
            </div>
        </Show>
    );
}