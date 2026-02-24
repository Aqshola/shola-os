export interface StartApp {
    title: string;
    icon: string;
    action: () => void;
}

export const START_APP_CONFIG = {
    portfolio: {
        title: "Portfolio",
        icon: "/assets/icons/kodak_imaging.ico",
        url: "https://portfolio-terminal-shola.netlify.app",
    },
    github: {
        title: "Github",
        icon: "/assets/icons/github.ico",
        url: "https://github.com/aqshol-claw",
    },
    linkedin: {
        title: "LinkedIn",
        icon: "/assets/icons/linkedin.ico",
        url: "https://linkedin.com/in/aqshol",
    },
    email: {
        title: "Email",
        icon: "/assets/icons/mailbox_world.ico",
    },
    resume: {
        title: "Resume",
        icon: "/assets/icons/certificate_2.ico",
    },
};
