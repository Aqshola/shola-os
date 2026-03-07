import { JSX } from "solid-js";
import EmailWindow from "@/apps/EmailWindow";
import ResumeWindow from "@/apps/ResumeWindow";
import PortfolioWindow from "@/apps/PortfolioWindow";
import PortfolioContentWindow from "@/apps/PortfolioContentWindow";
import AboutMeWindow from "@/apps/AboutMeWindow";
import { AppWindow } from "@/hooks/type";
import { useEmail } from "@/hooks/useEmail";
import { useResume } from "@/hooks/useResume";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useAboutMe } from "@/hooks/useAboutMe";
import { MODULE_ID } from "./module-id";

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
}


export function initializeStartApps() {
    const resume = useResume();
    const email = useEmail();
    const portfolio = usePortfolio();
    const aboutme = useAboutMe();

    const LIST_START_APP: StartApp[] = [
        {
            id: MODULE_ID.portofolio,
            title: "Portfolio",
            icon: "/assets/icons/kodak_imaging.ico",
            action: () => portfolio.open(),
            type: "window",
            component: PortfolioWindow,
            hooks: portfolio,
        },
        {
            id: "github",
            title: "Github",
            icon: "/assets/icons/github.ico",
            action: () => window.open("https://github.com/aqshola", "_blank"),
            type: "external",
        },
        {
            id: "linkedin",
            title: "LinkedIn",
            icon: "/assets/icons/linkedin.ico",
            action: () => window.open("https://linkedin.com/in/aqshol", "_blank"),
            type: "external",
        },
        {
            id: MODULE_ID.email,
            title: "Email",
            icon: "/assets/icons/mailbox_world.ico",
            action: () => email.open(),
            type: "window",
            component: EmailWindow,
            hooks: email,
        },
        {
            id: MODULE_ID.resume,
            title: "Resume",
            icon: "/assets/icons/certificate_2.ico",
            action: () => resume.open(),
            component: ResumeWindow,
            hooks: resume,
            type: "window",
        },
        {
            id: MODULE_ID.aboutme,
            title: "About Me",
            icon: "/assets/icons/certificate_2.ico",
            action: () => aboutme.open(),
            component: AboutMeWindow,
            hooks: aboutme,
            type: "window",
        },
  
        {
            id: "restart",
            title: "Restart",
            icon: "/assets/icons/restart.svg",
            action: () => {
                window.location.reload();
            },
            type: "action",
        },
              {
            id: "shutdown",
            title: "Shut Down...",
            icon: "/assets/icons/shutdown.svg",
            action: () => {
                // Try to close the window - may not work in all browsers
                window.open("", "_self")?.close();
            },
            type: "action",
        },
    ];

    return {
        LIST_START_APP,
    };
}
