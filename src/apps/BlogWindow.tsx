import { For, Show, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex } from "@/stores/windowStore";
import "@/pages/Desktop/style/window.css";
import { BlogPost } from "@/services/blog";
import BlogPostView from "@/components/blog/BlogPostView";

interface BlogWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
    hooks: any;
}

const WINDOW_ID = "blog";

export default function BlogWindow(props: BlogWindowProps) {
    return (
        <Show when={props.isOpen}>
            <ContentBlogWindow
                hooks={props.hooks}
                onClose={props.onClose}
                onMinimize={props.onMinimize}
                onRestore={props.onRestore}
            />
        </Show>
    );
}

interface PropsContentBlogWindow {
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
    hooks: any;
}

function ContentBlogWindow(props: PropsContentBlogWindow) {
    const [isMaximized, setIsMaximized] = createSignal(false);
    const [articleTitle, setArticleTitle] = createSignal<string | null>(null);
    const navigate = useNavigate();

    const defaultPosition = { x: window.innerWidth / 2, y: (window.innerHeight / 2) };
    const draggable = useDraggable({ x: defaultPosition.x, y: defaultPosition.y });

    const blog = props.hooks;

    const handleClose = () => {
        setArticleTitle(null);
        blog.closePost();
        props.onClose();
    };

    const handleMinimize = () => props.onMinimize();
    const handleMaximize = () => setIsMaximized(!isMaximized());

    const handleTitleBarClick = () => {
        bringToFront(WINDOW_ID);
    };

    const handlePostClick = (post: BlogPost) => {
        setArticleTitle(post.title);
        blog.openPost(post.slug);
    };

    const handleBackToCatalog = () => {
        setArticleTitle(null);
        blog.closePost();
    };

    const handleOpenFullPage = () => {
        navigate("/blogs");
    };

    return (
        <div
            class="window blog-window"
            classList={{
                "window-maximized": isMaximized(),
                "in-reader-mode": !!blog.activePostSlug(),
            }}
            style={{
                position: isMaximized() ? "fixed" : "absolute",
                left: isMaximized() ? "0" : `${draggable.position().x}px`,
                top: isMaximized() ? "0" : `${draggable.position().y}px`,
                width: isMaximized() ? "100%" : undefined,
                height: isMaximized() ? "calc(100vh - 28px)" : undefined,
                "z-index": getZIndex(WINDOW_ID),
            }}
            onMouseDown={handleTitleBarClick}
        >
            <div
                class="title-bar"
                onMouseDown={!isMaximized() ? draggable.handleMouseDown : undefined}
            >
                <div class="title-bar-text">
                    {blog.activePostSlug()
                        ? `📚 ${articleTitle() || "Article Reader"} - Shola OS Web Explorer`
                        : "📚 Blog - Shola OS"}
                </div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize" onClick={handleMinimize}></button>
                    <button aria-label="Maximize" onClick={handleMaximize}></button>
                    <button aria-label="Close" onClick={handleClose}></button>
                </div>
            </div>

            <div class="window-body blog-content">
                <Show
                    when={blog.activePostSlug()}
                    fallback={
                        <div class="blog-catalog-view">
                            {/* Top Toolbar */}
                            <div class="blog-modal-toolbar">
                                <button class="default" onClick={handleOpenFullPage}>
                                    🌐 View Full Page (/blogs)
                                </button>
                                <button onClick={() => blog.fetchPosts()} disabled={blog.loading()}>
                                    🔄 Refresh
                                </button>
                            </div>

                            {/* Posts List */}
                            <div class="blog-modal-list-container">
                                <Show when={!blog.loading()} fallback={<div class="loading">Loading posts...</div>}>
                                    <Show when={blog.posts().length > 0} fallback={<div class="no-posts">No posts available.</div>}>
                                        <div class="blog-grid">
                                            <For each={blog.posts()}>{(post) => (
                                                <div
                                                    class="blog-item"
                                                    onClick={() => handlePostClick(post)}
                                                >
                                                    <Show when={post.thumbnail} fallback={
                                                        <div class="blog-item-thumbnail-placeholder">
                                                            <span>📝</span>
                                                        </div>
                                                    }>
                                                        <img src={post.thumbnail} alt="" class="blog-item-thumbnail" />
                                                    </Show>
                                                    <div class="blog-item-info">
                                                        <span class="blog-item-title">{post.title}</span>
                                                        <span class="blog-item-excerpt">
                                                            {post.excerpt ? (post.excerpt.length > 80 ? post.excerpt.substring(0, 80) + "..." : post.excerpt) : "Click to read full article"}
                                                        </span>
                                                        <span class="blog-item-date">
                                                            {new Date(post.created).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}</For>
                                        </div>
                                    </Show>
                                </Show>
                            </div>

                            {/* Pagination Bar */}
                            <Show when={blog.totalPages() > 1}>
                                <div class="blog-pagination-bar">
                                    <button
                                        disabled={blog.page() <= 1 || blog.loading()}
                                        onClick={() => blog.prevPage()}
                                    >
                                        &lt; Previous
                                    </button>
                                    <span class="blog-pagination-text">
                                        Page {blog.page()} of {blog.totalPages()}
                                    </span>
                                    <button
                                        disabled={blog.page() >= blog.totalPages() || blog.loading()}
                                        onClick={() => blog.nextPage()}
                                    >
                                        Next &gt;
                                    </button>
                                </div>
                            </Show>
                        </div>
                    }
                >
                    <BlogPostView
                        postSlug={blog.activePostSlug()!}
                        onBack={handleBackToCatalog}
                        onTitleLoaded={(t) => setArticleTitle(t)}
                    />
                </Show>
            </div>

            <Show when={!blog.activePostSlug()}>
                <div class="status-bar">
                    <p class="status-bar-field">{blog.total()} Total Posts</p>
                    <p class="status-bar-field">{blog.loading() ? "Fetching..." : "Ready"}</p>
                </div>
            </Show>
        </div>
    );
}