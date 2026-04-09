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
import { MODULE_ID } from "@/module/module-id";

interface DesktopProps {
    appName?: string | null;
}

export default function Desktop(props: DesktopProps) {
    const resume = useResume();
    const portfolio = usePortfolio();
    const email = useEmail();
    const aboutme = useAboutMe();
    const notes = useNotes();

    onMount(() => {
        if (props.appName) {
            const appOpeners: Record<string, () => void> = {
                [MODULE_ID.resume]: () => resume.open(),
                [MODULE_ID.portofolio]: () => portfolio.open(),
                [MODULE_ID.email]: () => email.open(),
                [MODULE_ID.aboutme]: () => aboutme.open(),
                [MODULE_ID.notes]: () => notes.open(),
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