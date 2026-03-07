import { createSignal, onMount } from 'solid-js';
import '@/pages/Desktop/style/window.css'
import { windowStore, addActiveWindow, registerWindow } from '@/stores/windowStore'
import { useDeviceType } from '@/hooks/useDeviceType';
import { appStore } from '@/stores/appStore';

export default function Window() {
    const deviceType = useDeviceType();
    const desktopApp = appStore().filter(app => app.showIn?.desktop);
    
    const handleClick = (app: any) => {
        if (deviceType() === "mobile") {
            openApp(app);
        }
    };
    
    const handleDoubleClick = (app: any) => {
        if (deviceType() === "desktop") {
            openApp(app);
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
        <div class="desktop">
            <div class='container-desktop-icon'>
                {desktopApp.map((app) => (
                <div 
                    class='desktop-icon'
                    onClick={() => handleClick(app)}
                    onDblClick={() => handleDoubleClick(app)}
                >
                    <img src={app.icon} alt={app.title} class="desktop-icon-image" />
                    <p class='desktop-icon-text'>{app.title}</p>
                </div>
                ))}
            </div>
        </div>
    )
}
