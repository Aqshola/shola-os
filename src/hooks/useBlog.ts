import { createSignal } from "solid-js";
import { getListPosts, getPostBySlug, BlogPost } from "@/services/blog";
import { MODULE_ID } from "@/module/module-id";
import { setCurrentApp, setBlogSlug } from "@/stores/deepLinkStore";
import { makePersisted } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";

export function useBlog() {

    const [state, setState] = makePersisted(
        createStore({
            isOpen: false,
            isMinimized: false,
            posts: [] as BlogPost[],
            selectedPost: null as BlogPost | null,
        }),
        { name: "shola-os-notes-module" }
    );
    const [loading, setLoading] = createSignal(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const result = await getListPosts();
            setState({ posts: result });
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
            setState({ selectedPost: post });
            return post;
        } catch (error) {
            console.error("Failed to fetch post:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const openPost = (slug: string) => {
        setState({ selectedPost: null });
        setBlogSlug(slug);
        setCurrentApp(MODULE_ID.blog);
    };

    const closePost = () => {
        setState({ selectedPost: null });
    };

    const open = () => {
        setState({ isOpen: true });
        // fetchPosts();
        setCurrentApp(MODULE_ID.blog);
    };

    const close = () => {
        setState({ isOpen: false });
        closePost();
    };

    const minimize = () => {
        setState("isMinimized", true);
    };

    const restore = () => {
        setState({
            isMinimized: false,
            isOpen: true,
        });
    };

    const toggle = () => {
        if (state.isMinimized) {
            restore();
        } else if (state.isOpen) {
            minimize();
        } else {
            open();
        }
    };

    const isPostActive = () => state.selectedPost !== null;

    return {
         isMinimized: () => state.isMinimized,
    isActive: () => state.isOpen && !state.isMinimized,
    
        posts: () => state.posts,
        selectedPost: () => state.selectedPost,
        loading: () => loading(),
        isOpen: () => state.isOpen,
        fetchPosts,
        fetchPostBySlug,
        openPost,
        closePost,

        isPostActive,

        open,
        close,
        minimize,
        restore,
        toggle,
    };
}