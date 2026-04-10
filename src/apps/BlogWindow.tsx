import { For, Show, createSignal } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex, registerWindow, unregisterWindow } from "@/stores/windowStore";
import "@/pages/Desktop/style/window.css";
import { BlogPost } from "@/services/blog";
import PostWindow from "./PostWindow";

interface BlogWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
    hooks: any;
}

const WINDOW_ID = "blog";

export default function BlogWindow(props: BlogWindowProps) {
    const [isMaximized, setIsMaximized] = createSignal(false);

        const defaultPosition = { x: window.innerWidth / 2, y: (window.innerHeight / 2) };
    const draggable = useDraggable({ x: defaultPosition.x, y: defaultPosition.y });

    const blog = props.hooks;

    const handleClose = () => {
        blog.closePost();
        props.onClose();
    };

    const handleMinimize = () => props.onMinimize();
    const handleMaximize = () => setIsMaximized(!isMaximized());

    const handleTitleBarClick = () => {
        bringToFront(WINDOW_ID);
    };

    const handlePostClick = (post: BlogPost) => {
        blog.openPost(post.slug);
        registerWindow(`post-${post.slug}`);
    };
    

    return (
        <>
            <Show when={props.isOpen}>
                <div
                    class="window blog-window"
                    classList={{ "window-maximized": isMaximized() }}
                    style={{
                        position: isMaximized() ? "fixed" : "absolute",
                        left: isMaximized() ? "0" : `${draggable.position().x}px`,
                        top: isMaximized() ? "0" : `${draggable.position().y}px`,
                        "z-index": getZIndex(WINDOW_ID),
                    }}
                    onMouseDown={handleTitleBarClick}
                >
                    <div
                        class="title-bar"
                        onMouseDown={!isMaximized() ? draggable.handleMouseDown : undefined}
                    >
                        <div class="title-bar-text">Blog</div>
                        <div class="title-bar-controls">
                            <button aria-label="Minimize" onClick={handleMinimize}></button>
                            <button aria-label="Maximize" onClick={handleMaximize}></button>
                            <button aria-label="Close" onClick={handleClose}></button>
                        </div>
                    </div>
                    <div class="window-body blog-content">
                        <Show when={blog.loading()} fallback={
                            <div class="blog-grid">
                                <For each={blog.posts()}>{(post) => (
                                    <div
                                        class="blog-item"
                                        onClick={() => handlePostClick(post)}
                                    >
                                        <Show when={post.thumbnail}>
                                            <img src={post.thumbnail} alt="" class="blog-thumbnail" />
                                        </Show>
                                        <div class="blog-info">
                                            <span class="blog-title">{post.title}</span>
                                            <span class="blog-excerpt">
                                                {post.excerpt.substring(0, 80)}
                                                {post.excerpt.length > 80 ? "..." : ""}
                                            </span>
                                        </div>
                                    </div>
                                )}</For>
                            </div>
                        }>
                            <div class="loading">Loading posts...</div>
                        </Show>
                        <Show when={blog.posts().length === 0 && !blog.loading()}>
                            <div class="no-posts">No posts available.</div>
                        </Show>
                    </div>
                </div>

                <PostWindow
                    postSlug={blog.selectedPost()?.slug || null}
                    onClose={() => {
                        blog.closePost();
                    }}
                    onMinimize={() => handleMinimize()}
                    onRestore={() => {}}
                    hooks={blog}
                />
            </Show>
        </>
    );
}