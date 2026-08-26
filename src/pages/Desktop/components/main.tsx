import '@/pages/Desktop/style/window.css';
import { addActiveWindow, registerWindow } from '@/stores/windowStore';
import { useDeviceType } from '@/hooks/useDeviceType';
import { appStore } from '@/stores/appStore';
import { createSignal } from 'solid-js';

export default function Window() {
    const deviceType = useDeviceType();
    const desktopApp = () => appStore().filter(app => app.showIn?.desktop);
    const [selectedAppId, setSelectedAppId] = createSignal<string | null>(null);

    const handleClick = (app: any, e: MouseEvent) => {
        e.stopPropagation();
        setSelectedAppId(app.id);
        if (deviceType() === "mobile") {
            openApp(app);
        }
    };

    const handleDoubleClick = (app: any, e: MouseEvent) => {
        e.stopPropagation();
        setSelectedAppId(app.id);
        if (deviceType() === "desktop") {
            openApp(app);
        }
    };

    const handleDesktopClick = (e: MouseEvent) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('container-desktop-icon')) {
            setSelectedAppId(null);
        }
    };

    const openApp = (app: any) => {
        if (app.type === "window") {
            registerWindow(app.id);
            addActiveWindow(app);
            app.action();
        } else if (app.type === "external") {
            app.action();
        } else if (app.type === "action") {
            app.action();
        }
    };

    return (
        <div class="desktop" onClick={handleDesktopClick}>
            <div class='container-desktop-icon'>
                {desktopApp().map((app) => (
                    <div
                        class='desktop-icon'
                        classList={{ selected: selectedAppId() === app.id }}
                        onClick={(e) => handleClick(app, e)}
                        onDblClick={(e) => handleDoubleClick(app, e)}
                    >
                        <img src={app.icon} alt={app.title} class="desktop-icon-image" />
                        <p class='desktop-icon-text'>{app.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
