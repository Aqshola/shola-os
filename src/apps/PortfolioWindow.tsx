import { For, Show, onMount, onCleanup, createSignal } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex, registerWindow, unregisterWindow } from "@/stores/windowStore";
import { portfolioProjects, PortfolioProject } from "@/data/portfolioData";
import "@/pages/Desktop/style/window.css";
import { usePortfolio } from "@/hooks/usePortfolio";
import PortfolioContentWindow from "./PortfolioContentWindow";

interface PortfolioWindowProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
}

const WINDOW_ID = "portfolio";

export default function PortfolioWindow(props: PortfolioWindowProps) {
    const [isMaximized, setIsMaximized] = createSignal(false);
    const defaultPosition = { x: window.innerWidth / 2, y: (window.innerHeight / 2) * -1 };
    const draggable = useDraggable({ x: defaultPosition.x, y: defaultPosition.y });
    const portofolio = usePortfolio()

    onMount(() => {
        registerWindow(WINDOW_ID);
    });

    onCleanup(() => {
        unregisterWindow(WINDOW_ID);
    });

    const handleClose = () => props.onClose();
    const handleMinimize = () => props.onMinimize();
    const handleMaximize = () => setIsMaximized(!isMaximized());

    const handleTitleBarClick = () => {
        bringToFront(WINDOW_ID);
    };

    const handleProjectClick = (project: PortfolioProject) => {
        portofolio.openProject(project.id);
    };



    return (
        <>
            <Show when={props.isOpen}>
                <div
                    class="window portfolio-window"
                    classList={{ "window-maximized": isMaximized() }}
                    style={{
                        position: isMaximized() ? "fixed" : "absolute",
                        left: isMaximized() ? "0" : `${draggable.position().x}px`,
                        top: isMaximized() ? "0" : `${draggable.position().y}px`,
                        width: isMaximized() ? "100%" : undefined,
                        height: isMaximized() ? "calc(100vh - 28px)" : undefined,
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
                        <div class="portfolio-card-list">
                            <For each={portfolioProjects}>{(project) => (
                                <div
                                    class="portfolio-card"
                                    onClick={() => handleProjectClick(project)}
                                >
                                    <div class="portfolio-card-header">
                                        <img src={project.icon} alt="" class="portfolio-card-icon" />
                                        <span class="portfolio-card-title">{project.name}</span>
                                    </div>
                                    <img src={project.thumbnail} alt={project.name} class="portfolio-card-thumbnail" />
                                </div>
                            )}</For>
                        </div>
                    </div>
                </div>

                <PortfolioContentWindow
                    projectId={portofolio.openProjectId()}
                    onClose={() => portofolio.closeProject()}
                    onMinimize={() => handleMinimize()}
                    onRestore={() => portofolio.restoreContent()}
                />
            </Show>
        </>
    );
}
