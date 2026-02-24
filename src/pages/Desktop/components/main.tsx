import { LIST_DESKTOP_APP } from '@/module/desktop-module'
import '../style/window.css'
export default function Window() {
    return (
        <div class="desktop">
            <div class='container-desktop-icon'>
                {LIST_DESKTOP_APP.map((app) => (
                <div class='desktop-icon'>
                    <img src={app.icon} alt={app.alt} class="desktop-icon-image" />
                    <p class='desktop-icon-text'>{app.title}</p>
                </div>
                ))}
            </div>
        </div>)
}