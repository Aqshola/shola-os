export interface PortfolioProject {
    id: string;
    name: string;
    icon: string;
    thumbnail: string;
    description: string;
    demoUrl: string;
    repoUrl: string;
}

export const portfolioProjects: PortfolioProject[] = [
    {
        id: "terminal",
        name: "Terminal Portfolio",
        icon: "/assets/icons/kodak_imaging.ico",
        thumbnail: "https://placehold.co/400x200/000080/FFFFFF?text=Terminal+Portfolio",
        description: "Interactive terminal-style portfolio with draggable windows, command terminal, and desktop icons. Features include command-based navigation, themed windows, and a retro computing aesthetic.",
        demoUrl: "https://portfolio-terminal-shola.netlify.app",
        repoUrl: "https://github.com/aqshol-claw/portfolio-terminal",
    },
    {
        id: "landing",
        name: "Landing Page Portfolio",
        icon: "/assets/icons/kodak_imaging.ico",
        thumbnail: "https://placehold.co/400x200/000080/FFFFFF?text=Landing+Page",
        description: "Modern landing page portfolio built with React, TypeScript, and Tailwind CSS. Clean design with smooth animations and responsive layout.",
        demoUrl: "https://portfolio-landing-shola.netlify.app",
        repoUrl: "https://github.com/aqshol-claw/portfolio-landing",
    },
    {
        id: "win98",
        name: "Windows 98 Portfolio",
        icon: "/assets/icons/kodak_imaging.ico",
        thumbnail: "https://placehold.co/400x200/000080/FFFFFF?text=Win98+Portfolio",
        description: "Windows 98 themed portfolio with draggable windows, classic UI elements, and nostalgic desktop experience. Built with modern web technologies.",
        demoUrl: "https://portfolio-windows98.netlify.app",
        repoUrl: "https://github.com/aqshol-claw/portfolio-windows98",
    },
];
