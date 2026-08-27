import { createSignal, createEffect, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { PortableText } from "@portabletext/solid";
import { getPostBySlug, BlogPost } from "@/services/blog";
import "./style/blogs.css";

export default function BlogPostDetailPage() {
    const params = useParams();
    const navigate = useNavigate();

    const [post, setPost] = createSignal<BlogPost | null>(null);
    const [loading, setLoading] = createSignal(true);
    const [error, setError] = createSignal<string | null>(null);
    const [copied, setCopied] = createSignal(false);

    createEffect(async () => {
        const slug = params.slug;
        if (!slug) {
            setError("No article slug provided.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await getPostBySlug(slug);
            if (result) {
                setPost(result);
            } else {
                setError(`Post "${slug}" was not found.`);
            }
        } catch (err: any) {
            setError(err?.message || "Failed to load post.");
        } finally {
            setLoading(false);
        }
    });

    const handleBackToBlogs = () => {
        navigate("/blogs");
    };

    const handleGoToDesktop = () => {
        navigate("/");
    };

    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
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
        <div class="blogs-page-container">
            <div class="window blogs-browser-window">
                {/* Title Bar */}
                <div class="title-bar">
                    <div class="title-bar-text">
                        <img src="/assets/icons/blog.png" alt="" class="blogs-titlebar-icon" />
                        {post()?.title || "Article Reader"} - Shola OS Web Explorer
                    </div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize" onClick={handleGoToDesktop}></button>
                        <button aria-label="Maximize"></button>
                        <button aria-label="Close" onClick={handleBackToBlogs}></button>
                    </div>
                </div>

                {/* Menu Bar */}
                <div class="blogs-menubar">
                    <span class="blogs-menu-item" onClick={handleBackToBlogs}>&larr; Back to Blogs</span>
                    <span class="blogs-menu-item" onClick={handleGoToDesktop}>Desktop</span>
                    <span class="blogs-menu-item" onClick={handleCopyLink}>{copied() ? "Link Copied!" : "Copy Link"}</span>
                </div>

                {/* Navigation Toolbar */}
                <div class="blogs-toolbar">
                    <div class="blogs-toolbar-row">
                        <button class="blogs-nav-btn" onClick={handleBackToBlogs}>
                            &larr; All Articles
                        </button>
                        <button class="blogs-nav-btn" onClick={handleGoToDesktop}>
                            🖥️ Desktop
                        </button>
                        <button class="blogs-nav-btn" onClick={handleCopyLink}>
                            🔗 {copied() ? "Copied!" : "Share Link"}
                        </button>

                        <div class="blogs-address-bar">
                            <span class="blogs-address-label">Address:</span>
                            <input
                                type="text"
                                class="blogs-address-input"
                                value={typeof window !== "undefined" ? window.location.href : `http://shola.os/blog/${params.slug || ""}`}
                                readonly
                            />
                        </div>
                    </div>
                </div>

                {/* Main Article Body */}
                <div class="blogs-window-body">
                    <Show when={!loading()} fallback={<div class="blogs-loading">Fetching article from Emdash CMS...</div>}>
                        <Show when={!error()} fallback={
                            <div class="blogs-error">
                                <h2>Error Loading Article</h2>
                                <p>{error()}</p>
                                <button onClick={handleBackToBlogs} style={{ "margin-top": "12px" }}>
                                    &larr; Return to Articles Index
                                </button>
                            </div>
                        }>
                            <Show when={post()}>
                                <div class="article-reader-container">
                                    {/* Breadcrumb */}
                                    <div class="article-breadcrumb">
                                        <a onClick={handleGoToDesktop}>🖥️ Shola OS</a>
                                        <span>&gt;</span>
                                        <a onClick={handleBackToBlogs}>📚 Articles</a>
                                        <span>&gt;</span>
                                        <span>{post()!.title}</span>
                                    </div>

                                    {/* Article Header */}
                                    <header class="article-header">
                                        <h1 class="article-title">{post()!.title}</h1>
                                        <div class="article-meta-row">
                                            <span class="article-author-badge">
                                                👤 <span>{post()!.author}</span>
                                            </span>
                                            <span>📅 {formatDate(post()!.created)}</span>
                                            <Show when={post()!.status}>
                                                <span>🏷️ {post()!.status}</span>
                                            </Show>
                                        </div>
                                    </header>

                                    {/* Cover Image */}
                                    <Show when={post()!.thumbnail}>
                                        <div class="article-cover-wrap">
                                            <img
                                                src={post()!.thumbnail}
                                                alt={post()!.title}
                                                class="article-cover-img"
                                            />
                                        </div>
                                    </Show>

                                    {/* Article Body */}
                                    <article class="article-body">
                                        <Show
                                            when={Array.isArray(post()!.content)}
                                            fallback={
                                                <div innerHTML={typeof post()!.content === "string" ? (post()!.content as string) : ""} />
                                            }
                                        >
                                            <PortableText value={post()!.content as any} />
                                        </Show>
                                    </article>

                                    {/* Footer Navigation */}
                                    <div class="article-footer-nav">
                                        <button onClick={handleBackToBlogs} class="default">
                                            &larr; Back to All Articles
                                        </button>
                                        <button onClick={handleGoToDesktop}>
                                            🖥️ Return to Desktop
                                        </button>
                                    </div>
                                </div>
                            </Show>
                        </Show>
                    </Show>
                </div>

                {/* Status Bar */}
                <div class="blogs-statusbar">
                    <div class="blogs-status-field flex-grow">
                        <span>🌐</span>
                        <span>{loading() ? "Loading..." : "Done"}</span>
                    </div>
                    <div class="blogs-status-field">
                        <span>{post()?.slug || params.slug}</span>
                    </div>
                    <div class="blogs-status-field">
                        <span>Internet Zone</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
