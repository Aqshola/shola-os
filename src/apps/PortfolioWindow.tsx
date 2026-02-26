import { For } from "solid-js";
import { Show } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex } from "@/stores/windowStore";
import { portfolioProjects, PortfolioProject } from "@/data/portfolioData";
import "@/pages/Desktop/style/window.css";

interface PortfolioWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onOpenProject: (id: string) => void;
}

const WINDOW_ID = "portfolio";

export default function PortfolioWindow(props: PortfolioWindowProps) {
    const draggable = useDraggable({ x: 50, y: 30 });

    const handleClose = () => props.onClose();
    const handleMinimize = () => props.onMinimize();
    const handleMaximize = () => {
        // Optional: maximize functionality
    };

    const handleTitleBarClick = () => {
        bringToFront(WINDOW_ID);
    };

    const handleProjectClick = (project: PortfolioProject) => {
        props.onOpenProject(project.id);
    };

    return (
        <Show when={props.isOpen}>
            <div
                class="window portfolio-window"
                style={{
                    position: "absolute",
                    left: `${draggable.position().x}px`,
                    top: `${draggable.position().y}px`,
                    "z-index": getZIndex(WINDOW_ID),
                }}
                onMouseDown={handleTitleBarClick}
            >
                <div
                    class="title-bar"
                    onMouseDown={draggable.handleMouseDown}
                >
                    <div class="title-bar-text">Portfolio</div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize" onClick={handleMinimize}></button>
                        <button aria-label="Maximize" onClick={handleMaximize}></button>
                        <button aria-label="Close" onClick={handleClose}></button>
                    </div>
                </div>
                <div class="window-body portfolio-content">
                    <div class="portfolio-grid">
                        <For each={portfolioProjects}>{(project) => (
                            <div 
                                class="portfolio-folder"
                                onDblClick={() => handleProjectClick(project)}
                            >
                                <img src={project.icon} alt={project.name} class="portfolio-folder-icon" />
                                <span class="portfolio-folder-name">{project.name}</span>
                            </div>
                        )}</For>
                    </div>
                </div>
            </div>
        </Show>
    );
}
