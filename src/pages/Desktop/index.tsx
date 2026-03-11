import Window from "./components/main";
import Taskbar from "./components/taskbar";
import App from "./components/app";
import ShutdownScreen from "@/components/ShutdownScreen";
import { shutdownState } from "@/stores/shutdownStore";

export default function Desktop() {
    return (
        <div>
            <Window />
            <Taskbar />
            <App />
            <ShutdownScreen
                isOpen={shutdownState().isOpen}
                type={shutdownState().type}
                onComplete={shutdownState().onComplete || (() => {})}
            />
        </div>);
}