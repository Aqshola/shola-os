import { Show, createSignal, onCleanup, Accessor } from "solid-js";
import { useDraggable } from "@/hooks/useDraggable";
import { bringToFront, getZIndex, registerWindow, unregisterWindow } from "@/stores/windowStore";
import { Portfolio } from "@/services/portofolio";
import "@/pages/Desktop/style/window.css";

interface PortfolioContentWindowProps {
    projectId: string | null;
    selectedProject: Accessor<Portfolio | null>;
    loading: Accessor<boolean>;
    onClose: () => void;
    onMinimize: () => void;
    onRestore: () => void;
}

const WINDOW_ID_PREFIX = "portfolio-content-";

export default function PortfolioContentWindow(props: PortfolioContentWindowProps) {
    const [isMaximized, setIsMaximized] = createSignal(false);
    const windowId = () => props.projectId ? WINDOW_ID_PREFIX + props.projectId : null;
    const defaultPosition = { x: window.innerWidth / 2, y: (window.innerHeight / 2) };
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
        const project = props.selectedProject();
        if (project?.link) window.open(project.link, "_blank");
    };

    const openRepo = () => {
        const project = props.selectedProject();
        if (project?.repo) window.open(project.repo, "_blank");
    };

    const project = () => props.selectedProject();

    return (
        <Show when={props.projectId}>
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
                    <div class="title-bar-text">{project()?.title || "Project Details"}</div>
                    <div class="title-bar-controls">
                        <button aria-label="Minimize" onClick={handleMinimize}></button>
                        <button aria-label="Maximize" onClick={handleMaximize}></button>
                        <button aria-label="Close" onClick={handleClose}></button>
                    </div>
                </div>
                <Show when={props.loading()} fallback={
                    <div class="window-body portfolio-detail-content">
                        {/* Header */}
                        <div class="portfolio-detail-header">
                            <img src="/assets/icons/kodak_imaging.ico" alt="" class="portfolio-detail-icon" />
                            <span class="portfolio-detail-title">{project()?.title}</span>
                        </div>

                        {/* Buttons */}
                        <div class="portfolio-detail-buttons">
                            <Show when={project()?.repo}>
                                <button class="default" onClick={openRepo}>View Repo</button>
                            </Show>
                            <Show when={project()?.link}>
                                <button onClick={openDemo}>View Demo</button>
                            </Show>
                        </div>

                        {/* Screenshot */}
                        <Show when={project()?.image_cover}>
                            <img
                                src={project()?.image_cover}
                                alt={project()?.title}
                                class="portfolio-detail-screenshot"
                            />
                        </Show>

                        {/* Article/Description */}
                        <div class="portfolio-detail-article">
                            <p>{project()?.content || "No description available."}</p>
                        </div>
                    </div>
                }>
                    <div class="window-body">
                        <p>Loading project details...</p>
                    </div>
                </Show>
            </div>
        </Show>
    );
}
