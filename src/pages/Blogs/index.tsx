import { createSignal, createMemo, onMount, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { getListPosts, BlogPost } from "@/services/blog";
import "./style/blogs.css";

export default function BlogsPage() {
    const navigate = useNavigate();
    const [posts, setPosts] = createSignal<BlogPost[]>([]);
    const [total, setTotal] = createSignal(0);
    const [page, setPage] = createSignal(1);
    const [pageSize] = createSignal(9);
    const [loading, setLoading] = createSignal(true);
    const [searchQuery, setSearchQuery] = createSignal("");

    const fetchBlogPosts = async (targetPage: number) => {
        setLoading(true);
        try {
            const data = await getListPosts({
                page: targetPage,
                limit: pageSize(),
            });
            setPosts(data.items);
            setTotal(data.total);
            setPage(targetPage);
        } catch (error) {
            console.error("Failed to load blog posts:", error);
        } finally {
            setLoading(false);
        }
    };

    onMount(() => {
        fetchBlogPosts(1);
    });

    const totalPages = createMemo(() => {
        return Math.max(1, Math.ceil(total() / pageSize()));
    });

    const filteredPosts = createMemo(() => {
        const query = searchQuery().trim().toLowerCase();
        if (!query) return posts();
        return posts().filter(
            (p) =>
                p.title.toLowerCase().includes(query) ||
                (p.excerpt && p.excerpt.toLowerCase().includes(query)) ||
                (p.author && p.author.toLowerCase().includes(query))
        );
    });

    const handlePostClick = (slug: string) => {
        navigate(`/blog/${slug}`);
    };

    const handleGoToDesktop = () => {
        navigate("/");
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div class="blogs-page-container">
            <div class="window blogs-browser-window">
                {/* Title Bar */}
                <div class="title-bar">
                    <div class="title-bar-text">
                        <img src="/assets/icons/blog.png" alt="" class="blogs-titlebar-icon" />
                        Shola OS - Web Explorer (Articles & Blog)
                    </div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize" onClick={handleGoToDesktop}></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close" onClick={handleGoToDesktop}></button>
                    </div>
                </div>

                {/* Menu Bar */}
                <div class="blogs-menubar">
                    <span class="blogs-menu-item" onClick={handleGoToDesktop}>Desktop</span>
                    <span class="blogs-menu-item" onClick={() => fetchBlogPosts(page())}>Refresh</span>
                    <span class="blogs-menu-item" onClick={() => window.open("https://github.com/sholauwu", "_blank")}>Author</span>
                </div>

                {/* Navigation Toolbar */}
                <div class="blogs-toolbar">
                    <div class="blogs-toolbar-row">
                        <button class="blogs-nav-btn" onClick={handleGoToDesktop}>
                            🖥️ Desktop
                        </button>
                        <button class="blogs-nav-btn" onClick={() => fetchBlogPosts(1)}>
                            🏠 Home
                        </button>
                        <button class="blogs-nav-btn" onClick={() => fetchBlogPosts(page())} disabled={loading()}>
                            🔄 Reload
                        </button>

                        <div class="blogs-address-bar">
                            <span class="blogs-address-label">Address:</span>
                            <input
                                type="text"
                                class="blogs-address-input"
                                value="http://shola.os/blogs"
                                readonly
                            />
                        </div>

                        <input
                            type="text"
                            class="blogs-search-input"
                            placeholder="🔍 Filter articles..."
                            value={searchQuery()}
                            onInput={(e) => setSearchQuery(e.currentTarget.value)}
                        />
                    </div>
                </div>

                {/* Page Content Body */}
                <div class="blogs-window-body">
                    {/* Header Banner */}
                    <div class="blogs-header-banner">
                        <div>
                            <h1 class="blogs-header-title">Random Thoughts</h1>
                            <p class="blogs-header-subtitle">
                                idk, probably will write random things in here
                            </p>
                        </div>
                    </div>

                    {/* Posts View */}
                    <Show when={!loading()} fallback={<div class="blogs-loading">loading posts...</div>}>
                        <Show when={filteredPosts().length > 0} fallback={
                            <div class="blogs-empty">
                                <p>No blog posts found matching your criteria.</p>
                            </div>
                        }>
                            <div class="blogs-cards-grid">
                                <For each={filteredPosts()}>{(post) => (
                                    <div class="blog-card" onClick={() => handlePostClick(post.slug)}>
                                        <div class="blog-card-thumbnail-wrap">
                                            <Show when={post.thumbnail} fallback={
                                                <div class="blog-card-thumbnail-placeholder">📝</div>
                                            }>
                                                <img
                                                    src={post.thumbnail}
                                                    alt={post.title}
                                                    class="blog-card-thumbnail"
                                                    loading="lazy"
                                                />
                                            </Show>
                                        </div>
                                        <div class="blog-card-content">
                                            <div class="blog-card-meta">
                                                <span>By {post.author}</span>
                                                <span>{formatDate(post.created)}</span>
                                            </div>
                                            <h3 class="blog-card-title">{post.title}</h3>
                                            <p class="blog-card-excerpt">
                                                {post.excerpt || "Read full article for details, code snippets, and in-depth discussions..."}
                                            </p>
                                            <div class="blog-card-footer">
                                                <button class="blog-card-read-btn">Read Article &rarr;</button>
                                            </div>
                                        </div>
                                    </div>
                                )}</For>
                            </div>
                        </Show>
                    </Show>

                    {/* Pagination */}
                    <Show when={totalPages() > 1}>
                        <div class="blogs-pagination-section">
                            <button
                                disabled={page() <= 1 || loading()}
                                onClick={() => fetchBlogPosts(page() - 1)}
                            >
                                &lt; Previous
                            </button>
                            <span class="blogs-pagination-info">
                                Page {page()} of {totalPages()} ({total()} Total Articles)
                            </span>
                            <button
                                disabled={page() >= totalPages() || loading()}
                                onClick={() => fetchBlogPosts(page() + 1)}
                            >
                                Next &gt;
                            </button>
                        </div>
                    </Show>
                </div>

                {/* Status Bar */}
                <div class="blogs-statusbar">
                    <div class="blogs-status-field flex-grow">
                        <span>🌐</span>
                        <span>{loading() ? "Loading data from server..." : "Done"}</span>
                    </div>
                    <div class="blogs-status-field">
                        <span>{total()} Articles</span>
                    </div>
                    <div class="blogs-status-field">
                        <span>Internet Zone</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
