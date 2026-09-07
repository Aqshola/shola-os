import { Show, createSignal, createEffect } from "solid-js";
import BlogPostContent from "./BlogPostContent";
import "@/pages/Blogs/style/blogs.css";
import { getPostBySlug, BlogPost } from "@/services/blog";

interface BlogPostViewProps {
    postSlug: string;
    onBack: () => void;
    onTitleLoaded?: (title: string) => void;
}

export default function BlogPostView(props: BlogPostViewProps) {
    const [post, setPost] = createSignal<BlogPost | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);
    const [copied, setCopied] = createSignal(false);

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
                if (props.onTitleLoaded) {
                    props.onTitleLoaded(result.title);
                }
            } else {
                setError(`Post "${slug}" was not found.`);
            }
        } catch (e: any) {
            setError(e?.message || "Failed to load post.");
        } finally {
            setLoading(false);
        }
    });

    const handleBack = () => {
        props.onBack();
    };

    const handleOpenFullPage = () => {
        if (props.postSlug) {
            window.open(`/blog/${props.postSlug}`, "_blank");
        }
    };

    const handleCopyLink = () => {
        if (props.postSlug && typeof window !== "undefined") {
            const url = `${window.location.origin}/blog/${props.postSlug}`;
            navigator.clipboard.writeText(url);
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
        <div class="blog-reader-view" style={{ flex: "1", display: "flex", "flex-direction": "column", overflow: "hidden" }}>
            {/* Menu Bar */}
            <div class="blogs-menubar">
                <span class="blogs-menu-item" onClick={handleBack}>&larr; Back to Blogs</span>
                <span class="blogs-menu-item" onClick={handleOpenFullPage}>Full Page Mode</span>
                <span class="blogs-menu-item" onClick={handleCopyLink}>{copied() ? "Link Copied!" : "Copy Link"}</span>
            </div>

            {/* Navigation Toolbar */}
            <div class="blogs-toolbar">
                <div class="blogs-toolbar-row">
                    <button class="blogs-nav-btn" onClick={handleBack}>
                        &larr; Back to Blogs
                    </button>
                    <button class="blogs-nav-btn" onClick={handleOpenFullPage}>
                        🌐 Full Page Mode
                    </button>
                    <button class="blogs-nav-btn" onClick={handleCopyLink}>
                        🔗 {copied() ? "Copied!" : "Share Link"}
                    </button>

                    <div class="blogs-address-bar">
                        <span class="blogs-address-label">Address:</span>
                        <input
                            type="text"
                            class="blogs-address-input"
                            value={`http://shola.os/blog/${props.postSlug || ""}`}
                            readonly
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Body */}
            <div class="blogs-window-body" style={{ flex: "1", "overflow-y": "auto", margin: "2px", padding: "16px 20px" }}>
                <Show when={!loading()} fallback={<div class="blogs-loading">Get Data</div>}>
                    <Show when={!error()} fallback={
                        <div class="blogs-error">
                            <h2>Error Loading Article</h2>
                            <p>{error()}</p>
                            <button onClick={handleBack} style={{ "margin-top": "12px" }}>
                                &larr; Return to Blogs List
                            </button>
                        </div>
                    }>
                        <Show when={post()}>
                            <div class="article-reader-container" style={{ "max-width": "100%" }}>
                                {/* Breadcrumb */}
                                <div class="article-breadcrumb">
                                    <a onClick={handleBack}>🖥️ Shola OS</a>
                                    <span>&gt;</span>
                                    <a onClick={handleBack}>📚 Articles</a>
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

                                {/* Article Body with Rich Content Support */}
                                <BlogPostContent content={post()!.content} />

                                {/* Footer Navigation */}
                                <div class="article-footer-nav">
                                    <button onClick={handleBack} class="default">
                                        &larr; Back to Blogs
                                    </button>
                                    <button onClick={handleOpenFullPage}>
                                        🌐 Open Full Page Mode
                                    </button>
                                </div>
                            </div>
                        </Show>
                    </Show>
                </Show>
            </div>

            {/* Embedded View Status Bar */}
            <div class="blogs-statusbar">
                <div class="blogs-status-field flex-grow">
                    <span>🌐</span>
                    <span>{loading() ? "Loading..." : "Done"}</span>
                </div>
                <div class="blogs-status-field">
                    <span>{post()?.slug || props.postSlug}</span>
                </div>
                <div class="blogs-status-field">
                    <span>Internet Zone</span>
                </div>
            </div>
        </div>
    );
}
