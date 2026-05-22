import Window from "./components/main";
import Taskbar from "./components/taskbar";
import App from "./components/app";
import ShutdownScreen from "@/components/ShutdownScreen";
import { shutdownState } from "@/stores/shutdownStore";
import { onMount } from "solid-js";
import { useResume } from "@/hooks/useResume";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useEmail } from "@/hooks/useEmail";
import { useAboutMe } from "@/hooks/useAboutMe";
import { useNotes } from "@/hooks/useNotes";
import { useBlog } from "@/hooks/useBlog";
import { MODULE_ID } from "@/module/module-id";
import { registerWindow } from "@/stores/windowStore";

interface DesktopProps {
    appName?: string | null;
    blogSlug?: string | null;
}

export default function Desktop(props: DesktopProps) {
    const resume = useResume();
    const portfolio = usePortfolio();
    const email = useEmail();
    const aboutme = useAboutMe();
    const notes = useNotes();
    const blog = useBlog();

    onMount(() => {
        // Handle blog with slug first (deep linking)
        if (props.appName === MODULE_ID.blog && props.blogSlug) {
            blog.open();
            blog.fetchPostBySlug(props.blogSlug).then((post) => {
                if (post) {
                    blog.openPost(post.slug);
                    registerWindow(`post-${post.slug}`);
                }
            });
            return;
        }

        // Handle regular app opening
        if (props.appName) {
            const appOpeners: Record<string, () => void> = {
                [MODULE_ID.resume]: () => resume.open(),
                [MODULE_ID.portofolio]: () => portfolio.open(),
                [MODULE_ID.email]: () => email.open(),
                [MODULE_ID.aboutme]: () => aboutme.open(),
                [MODULE_ID.notes]: () => notes.open(),
                [MODULE_ID.blog]: () => blog.open(),
            };
            const opener = appOpeners[props.appName];
            if (opener) {
                opener();
            }
        }
    });

    return (
        <div>
            <Window />
            <Taskbar />
            <App />
            <ShutdownScreen
                isOpen={shutdownState().isOpen}
                type={shutdownState().type}
                onComplete={shutdownState().onComplete || (() => {})}
            />
        </div>);
}