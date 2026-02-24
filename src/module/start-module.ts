import { JSX } from "solid-js";
import EmailWindow from "../apps/EmailWindow";
import ResumeWindow from "../apps/ResumeWindow";
import { AppWindow } from "../hooks/type";
import { useEmail } from "../hooks/useEmail";
import { useResume } from "../hooks/useResume";

export interface StartApp {
    title: string;
    icon: string;
    action: () => void;
    type?: "window" | "external";
    component?: (props: any) => JSX.Element; // Optional component to render when the app is opened
    hooks?: AppWindow; // Optional hooks to manage app state
}


export function initializeStartApps() {
    const resume = useResume();
    const email = useEmail();



    const LIST_START_APP: StartApp[] = [
        {
            title: "Portfolio",
            icon: "/assets/icons/kodak_imaging.ico",
            action: () => window.open("https://portfolio-terminal-shola.netlify.app", "_blank"),
            type: "external",
        },
        {
            title: "Github",
            icon: "/assets/icons/github.ico",
            action: () => window.open("https://github.com/aqshola", "_blank"),
            type: "external",
        },
        {
            title: "LinkedIn",
            icon: "/assets/icons/linkedin.ico",
            action: () => window.open("https://linkedin.com/in/aqshol", "_blank"),
            type: "external",
        },
        {
            title: "Email",
            icon: "/assets/icons/mailbox_world.ico",
            action: () => {
                email.open()
            },
            type: "window",
            component: EmailWindow,
            hooks: email,
        },
        {
            title: "Resume",
            icon: "/assets/icons/certificate_2.ico",
            action: () => {
                resume.open()
            },
            component: ResumeWindow,
            hooks: resume,
            type: "window",
        }
    ]



    return { LIST_START_APP };

}
