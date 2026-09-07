import { Show, createSignal } from "solid-js";
import { PortableText, type PortableTextComponents } from "@portabletext/solid";
import type { PortableTextBlock } from "@portabletext/types";
import { resolveImageUrl } from "@/services/blog";

export interface BlogPostContentProps {
    content?: PortableTextBlock[] | string;
}

function CodeBlock(props: { value?: any }) {
    const [copied, setCopied] = createSignal(false);

    const handleCopy = () => {
        const text = props.value?.code || "";
        if (text && typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const language = () => (props.value?.language || "code").toUpperCase();

    return (
        <div class="article-code-window window">
            <div class="title-bar article-code-header">
                <div class="title-bar-text">
                    <span class="code-icon">💻</span>
                    <span class="code-lang">{language()}</span>
                    <Show when={props.value?.filename}>
                        <span class="code-filename"> - {props.value.filename}</span>
                    </Show>
                </div>
                <div class="title-bar-controls">
                    <button
                        type="button"
                        class="article-code-copy-btn"
                        onClick={handleCopy}
                        title="Copy code to clipboard"
                    >
                        {copied() ? "✓ Copied" : "📋 Copy"}
                    </button>
                </div>
            </div>
            <div class="window-body article-code-body">
                <pre class="article-code-pre">
                    <code>{props.value?.code || ""}</code>
                </pre>
            </div>
        </div>
    );
}

function ImageBlock(props: { value?: any }) {
    const imageUrl = () => resolveImageUrl(props.value);
    const altText = () => props.value?.alt || props.value?.asset?.alt || "Article illustration";
    const caption = () => props.value?.caption || props.value?.meta?.caption || props.value?.asset?.meta?.caption;

    return (
        <Show when={imageUrl()}>
            <figure class="article-content-image-wrap">
                <img
                    src={imageUrl()}
                    alt={altText()}
                    class="article-content-image"
                    loading="lazy"
                />
                <Show when={caption()}>
                    <figcaption class="article-image-caption">{caption()}</figcaption>
                </Show>
            </figure>
        </Show>
    );
}

const portableTextComponents: PortableTextComponents = {
    types: {
        code: CodeBlock,
        image: ImageBlock,
    },
    marks: {
        link: (props) => {
            const href = props.value?.href || "";
            const isExternal = href.startsWith("http://") || href.startsWith("https://");
            return (
                <a
                    href={href}
                    target={props.value?.blank || isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    class="article-link"
                >
                    {props.children}
                </a>
            );
        },
    },
    block: {
        normal: (props) => {
            // Check if this block represents a horizontal rule divider "---"
            const children = props.value?.children;
            if (
                Array.isArray(children) &&
                children.length === 1 &&
                typeof children[0]?.text === "string" &&
                children[0].text.trim() === "---"
            ) {
                return <hr class="article-divider" />;
            }
            return <p>{props.children}</p>;
        },
        blockquote: (props) => {
            return <blockquote class="article-blockquote">{props.children}</blockquote>;
        },
        h1: (props) => <h1>{props.children}</h1>,
        h2: (props) => <h2>{props.children}</h2>,
        h3: (props) => <h3>{props.children}</h3>,
        h4: (props) => <h4>{props.children}</h4>,
    },
};

export default function BlogPostContent(props: BlogPostContentProps) {
    return (
        <article class="article-body">
            <Show
                when={Array.isArray(props.content)}
                fallback={
                    <div innerHTML={typeof props.content === "string" ? props.content : ""} />
                }
            >
                <PortableText
                    value={props.content as any}
                    components={portableTextComponents}
                />
            </Show>
        </article>
    );
}
