import { Show, createSignal, onMount, onCleanup } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex, registerWindow, unregisterWindow } from "@/stores/windowStore";
import { portfolioProjects, PortfolioProject } from "@/data/portfolioData";
import "@/pages/Desktop/style/window.css";

interface PortfolioContentWindowProps {
    projectId: string | null;
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
}

const WINDOW_ID_PREFIX = "portfolio-content-";

export default function PortfolioContentWindow(props: PortfolioContentWindowProps) {
    const [isMaximized, setIsMaximized] = createSignal(false);
    const project = () => portfolioProjects.find(p => p.id === props.projectId);
    const windowId = () => props.projectId ? WINDOW_ID_PREFIX + props.projectId : null;
    const defaultPosition = { x: window.innerWidth / 2, y: (window.innerHeight / 2) * -1 };
    const draggable = useDraggable({ x: defaultPosition.x, y: defaultPosition.y });



    onCleanup(() => {
        const id = windowId();
        if (id) unregisterWindow(id);
    });

    const handleClose = () => props.onClose();
    const handleMinimize = () => props.onMinimize();
    const handleMaximize = () => setIsMaximized(!isMaximized());

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
                classList={{ "window-maximized": isMaximized() }}
                style={{
                    position: isMaximized() ? "fixed" : "absolute",
                    left: isMaximized() ? "" : `${draggable.position().x}px`,
                    top: isMaximized() ? "" : `${draggable.position().y}px`,
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
                        <button aria-label="Minimize" onClick={handleMinimize}></button>
                        <button aria-label="Maximize" onClick={handleMaximize}></button>
                        <button aria-label="Close" onClick={handleClose}></button>
                    </div>
                </div>
                <div class="window-body portfolio-detail-content">
                    {/* Header */}
                    <div class="portfolio-detail-header">
                        <img src={project()?.icon} alt="" class="portfolio-detail-icon" />
                        <span class="portfolio-detail-title">{project()?.name}</span>
                    </div>

                    {/* Buttons */}
                    <div class="portfolio-detail-buttons">
                        <button class="default" onClick={openRepo}>View Repo</button>
                        <button onClick={openDemo}>View Demo</button>
                    </div>

                    {/* Screenshot */}
                    <img
                        src={project()?.thumbnail}
                        alt={project()?.name}
                        class="portfolio-detail-screenshot"
                    />

                    {/* Article/Description */}
                    <div class="portfolio-detail-article">
                        <p>{project()?.description}</p>
                    </div>
                </div>
            </div>
        </Show>
    );
}
