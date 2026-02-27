import { Show } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex } from "@/stores/windowStore";
import { portfolioProjects, PortfolioProject } from "@/data/portfolioData";
import "@/pages/Desktop/style/window.css";

interface PortfolioContentWindowProps {
    projectId: string | null;
    onClose: () => void;
}

const WINDOW_ID_PREFIX = "portfolio-content-";

export default function PortfolioContentWindow(props: PortfolioContentWindowProps) {
    const project = () => portfolioProjects.find(p => p.id === props.projectId);
    const windowId = () => props.projectId ? WINDOW_ID_PREFIX + props.projectId : null;
    const draggable = useDraggable({ x: 100, y: 80 });

    const handleClose = () => props.onClose();

    const handleTitleBarClick = () => {
        const id = windowId();
        if (id) bringToFront(id);
    };

    const openDemo = () => {
        const p = project();
        if (p) window.open(p.demoUrl, "_blank");
    };

    const openRepo = () => {
        const p = project();
        if (p) window.open(p.repoUrl, "_blank");
    };

    return (
        <Show when={props.projectId && project()}>
            <div
                class="window portfolio-content-window"
                style={{
                    position: "absolute",
                    left: `${draggable.position().x}px`,
                    top: `${draggable.position().y}px`,
                    "z-index": getZIndex(windowId()!),
                }}
                onMouseDown={handleTitleBarClick}
            >
                <div
                    class="title-bar"
                    onMouseDown={draggable.handleMouseDown}
                >
                    <div class="title-bar-text">{project()?.name}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Close" onClick={handleClose}></button>
                    </div>
                </div>
                <div class="window-body">
                    <div class="portfolio-project-info">
                        <img 
                            src={project()?.icon} 
                            alt={project()?.name} 
                            class="portfolio-project-icon" 
                        />
                        <p class="portfolio-project-description">{project()?.description}</p>
                    </div>
                    <div class="portfolio-project-links">
                        <button class="default" onClick={openDemo}>View Demo</button>
                        <button onClick={openRepo}>View Repo</button>
                    </div>
                </div>
            </div>
        </Show>
    );
}
