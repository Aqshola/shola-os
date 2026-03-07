import '@/pages/Desktop/style/window.css'
import { windowStore } from '@/stores/windowStore'
export default function Window() {
    const desktopApp=windowStore.appList.filter(app=>app.showIn.desktop)
    return (
        <div class="desktop">
            <div class='container-desktop-icon'>
                {desktopApp.map((app) => (
                <div class='desktop-icon'>
                    <img src={app.icon} alt={app.title} class="desktop-icon-image" />
                    <p class='desktop-icon-text'>{app.title}</p>
                </div>
                ))}
            </div>
        </div>
        )
}