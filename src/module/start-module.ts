import { JSX } from "solid-js";
import EmailWindow from "@/apps/EmailWindow";
import ResumeWindow from "@/apps/ResumeWindow";
import PortfolioWindow from "@/apps/PortfolioWindow";
import PortfolioContentWindow from "@/apps/PortfolioContentWindow";
import { AppWindow } from "@/hooks/type";
import { useEmail } from "@/hooks/useEmail";
import { useResume } from "@/hooks/useResume";
import { usePortfolio } from "@/hooks/usePortfolio";

export interface StartApp {
    id: string;
    title: string;
    icon: string;
    action: () => void;
    type?: "window" | "external";
    component?: (props: any) => JSX.Element;
    hooks?: AppWindow;
    contentComponent?: (props: any) => JSX.Element;
    contentHooks?: AppWindow;
}


export function initializeStartApps() {
    const resume = useResume();
    const email = useEmail();
    const portfolio = usePortfolio();

    const LIST_START_APP: StartApp[] = [
        {
            id: "portfolio",
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
            id: "email",
            title: "Email",
            icon: "/assets/icons/mailbox_world.ico",
            action: () => email.open(),
            type: "window",
            component: EmailWindow,
            hooks: email,
        },
        {
            id: "resume",
            title: "Resume",
            icon: "/assets/icons/certificate_2.ico",
            action: () => resume.open(),
            component: ResumeWindow,
            hooks: resume,
            type: "window",
        }
    ];

    return { 
        LIST_START_APP,
        portfolio,
        contentComponent: PortfolioContentWindow,
    };
}
