import { createSignal, createMemo } from "solid-js";
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
            page: 1,
            pageSize: 6,
            total: 0,
        }),
        { name: "shola-os-blog-module" }
    );
    const [loading, setLoading] = createSignal(false);

    const totalPages = createMemo(() => {
        const total = state.total || 0;
        const size = state.pageSize || 6;
        return Math.max(1, Math.ceil(total / size));
    });

    const fetchPosts = async (targetPage?: number, targetPageSize?: number) => {
        const pageToFetch = targetPage ?? state.page;
        const limitToFetch = targetPageSize ?? state.pageSize;
        setLoading(true);
        try {
            const result = await getListPosts({
                page: pageToFetch,
                limit: limitToFetch,
            });
            setState({
                posts: result.items,
                total: result.total,
                page: pageToFetch,
                pageSize: limitToFetch,
            });
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages() || page === state.page) return;
        fetchPosts(page);
    };

    const nextPage = () => {
        if (state.page < totalPages()) {
            goToPage(state.page + 1);
        }
    };

    const prevPage = () => {
        if (state.page > 1) {
            goToPage(state.page - 1);
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
        setCurrentApp(MODULE_ID.blog);
        fetchPosts(state.page);
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
        page: () => state.page,
        pageSize: () => state.pageSize,
        total: () => state.total,
        totalPages,
        loading: () => loading(),
        isOpen: () => state.isOpen,
        fetchPosts,
        goToPage,
        nextPage,
        prevPage,
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