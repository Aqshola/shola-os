import { JSX } from "solid-js";
import EmailWindow from "@/apps/EmailWindow";
import ResumeWindow from "@/apps/ResumeWindow";
import PortfolioWindow from "@/apps/PortfolioWindow";
import AboutMeWindow from "@/apps/AboutMeWindow";
import NotesWindow from "@/apps/NotesWindow";
import BlogWindow from "@/apps/BlogWindow";
import { AppWindow } from "@/hooks/type";
import { useEmail } from "@/hooks/useEmail";
import { useResume } from "@/hooks/useResume";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useAboutMe } from "@/hooks/useAboutMe";
import { useNotes } from "@/hooks/useNotes";
import { useBlog } from "@/hooks/useBlog";
import { MODULE_ID } from "./module-id";
import { clearLocalStorage, removeFromLocalStorage } from "@/lib/localstorage";
import { openShutdown } from "@/stores/shutdownStore";
import { setCurrentApp } from "@/stores/deepLinkStore";
import { social } from "@/stores/socialStore";

export interface StartApp {
    id: string;
    title: string;
    icon: string;
    action: () => void;
    type?: "window" | "external" | "action";
    component?: (props: any) => JSX.Element;
    hooks?: AppWindow;
    contentComponent?: (props: any) => JSX.Element;
    contentHooks?: AppWindow;
    showIn: {
        desktop?: boolean;
        taskbar?: boolean;
        start?: boolean;
    }

}


export function initializeStartApps() {
    const resume = useResume();
    const email = useEmail();
    const portfolio = usePortfolio();
    const aboutme = useAboutMe();
    const notes = useNotes();
    const blog = useBlog();

    const LIST_START_APP: StartApp[] = [
        {
            id: MODULE_ID.portofolio,
            title: "Portfolio",
            icon: "/assets/icons/kodak_imaging.ico",
            action: () => { portfolio.open(); setCurrentApp(MODULE_ID.portofolio); },
            type: "window",
            component: PortfolioWindow,
            hooks: portfolio,
            showIn: {
                desktop: true,
                start: true,
            },
        },
        {
            id: "github",
            title: "Github",
            icon: "/assets/icons/github.ico",
            action: () => window.open(social.github, "_blank"),
            type: "external",
            showIn: {
                start: true,
                taskbar: true,
            },
        },
        {
            id: "linkedin",
            title: "LinkedIn",
            icon: "/assets/icons/linkedin.ico",
            action: () => window.open(social.linkedin, "_blank"),
            type: "external",
            showIn: {
                start: true,
                taskbar: true,
            },

        },
        {
            id: MODULE_ID.email,
            title: "Email",
            icon: "/assets/icons/mailbox_world.ico",
            action: () => { email.open(); setCurrentApp(MODULE_ID.email); },
            type: "window",
            component: EmailWindow,
            hooks: email,
            showIn: {
                start: true,
                taskbar: true,
                desktop: true,
            },
        },
        {
            id: MODULE_ID.resume,
            title: "Resume",
            icon: "/assets/icons/certificate_2.ico",
            action: () => { resume.open(); setCurrentApp(MODULE_ID.resume); },
            component: ResumeWindow,
            hooks: resume,
            type: "window",
            showIn: {
                start: true,
                desktop: true,
            },
        },
        {
            id: MODULE_ID.aboutme,
            title: "About Me",
            icon: "/assets/icons/profile.webp",
            action: () => { aboutme.open(); setCurrentApp(MODULE_ID.aboutme); },
            component: AboutMeWindow,
            hooks: aboutme,
            type: "window",
            showIn: {
                start: true,
                desktop: true,
            },
        },
        {
            id: MODULE_ID.notes,
            title: "Notepad",
            icon: "/assets/icons/note.png",
            action: () => {notes.open(); setCurrentApp(MODULE_ID.notes);},
            component: NotesWindow,
            hooks: notes,
            type: "window",
            showIn: {
                start: true,
                desktop: true,
            },
        },
        {
            id: MODULE_ID.blog,
            hooks: blog,
            title: "Blog",
            icon: "/assets/icons/blog.png",
            action: () => { blog.open(); setCurrentApp(MODULE_ID.blog); },
            type: "window",
            component: BlogWindow,
            showIn: {
                start: true,
                desktop: true,
            },
        },

        {
            id: "restart",
            title: "Restart",
            icon: "/assets/icons/restart.svg",
            action: () => {
                openShutdown("restart", () => {
                    removeFromLocalStorage("SHOLA_OS_LOADED");
                    window.location.reload();
                });
            },
            type: "action",
            showIn: {
                start: true,
            },
        },
        {
            id: "shutdown",
            title: "Shut Down...",
            icon: "/assets/icons/shutdown.svg",
            action: () => {
                openShutdown("shutdown", () => {
                    clearLocalStorage();
                    window.location.href = "/";
                });
            },
            type: "action",
            showIn: {
                start: true,
            },
        },
    ];

    return {
        LIST_START_APP,
    };
}
