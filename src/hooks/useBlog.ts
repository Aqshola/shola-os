import { createSignal } from "solid-js";
import { getListPosts, getPostBySlug, BlogPost } from "@/services/blog";
import { MODULE_ID } from "@/module/module-id";
import { setCurrentApp, setBlogSlug } from "@/stores/deepLinkStore";

export function useBlog() {
    const [posts, setPosts] = createSignal<BlogPost[]>([]);
    const [selectedPost, setSelectedPost] = createSignal<BlogPost | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [isOpen, setIsOpen] = createSignal(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const result = await getListPosts();
            setPosts(result);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPostBySlug = async (slug: string) => {
        setLoading(true);
        try {
            const post = await getPostBySlug(slug);
            setSelectedPost(post);
            return post;
        } catch (error) {
            console.error("Failed to fetch post:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const openPost = (slug: string) => {
        setSelectedPost(null);
        setBlogSlug(slug);
        setCurrentApp(MODULE_ID.blog);
    };

    const closePost = () => {
        setSelectedPost(null);
    };

    const open = () => {
        setIsOpen(true);
        fetchPosts();
        setCurrentApp(MODULE_ID.blog);
    };

    const close = () => {
        setIsOpen(false);
        closePost();
    };

    const isPostActive = () => selectedPost() !== null;

    return {
        posts,
        selectedPost,
        loading,
        isOpen,
        fetchPosts,
        fetchPostBySlug,
        openPost,
        closePost,
        open,
        close,
        isPostActive,
    };
}