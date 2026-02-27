export interface PortfolioProject {
    id: string;
    name: string;
    icon: string;
    description: string;
    demoUrl: string;
    repoUrl: string;
}

export const portfolioProjects: PortfolioProject[] = [
    {
        id: "terminal",
        name: "Terminal Portfolio",
        icon: "/assets/icons/kodak_imaging.ico",
        description: "Interactive terminal-style portfolio with draggable windows, command terminal, and desktop icons.",
        demoUrl: "https://portfolio-terminal-shola.netlify.app",
        repoUrl: "https://github.com/aqshol-claw/portfolio-terminal",
    },
    {
        id: "landing",
        name: "Landing Page Portfolio",
        icon: "/assets/icons/kodak_imaging.ico",
        description: "Modern landing page portfolio built with React and Tailwind CSS.",
        demoUrl: "https://portfolio-landing-shola.netlify.app",
        repoUrl: "https://github.com/aqshol-claw/portfolio-landing",
    },
    {
        id: "win98",
        name: "Windows 98 Portfolio",
        icon: "/assets/icons/kodak_imaging.ico",
        description: "Windows 98 themed portfolio with draggable windows and classic UI.",
        demoUrl: "https://portfolio-windows98.netlify.app",
        repoUrl: "https://github.com/aqshol-claw/portfolio-windows98",
    },
];
