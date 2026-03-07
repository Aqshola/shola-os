import Window from "./components/main";
import Taskbar from "./components/taskbar";
import App from "./components/app";

export default function Desktop() {
    return (
        <div>
            
            <Window />
            <Taskbar />
            <App/>

        </div>);
}