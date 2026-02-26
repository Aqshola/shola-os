import { createSignal } from "solid-js"

export function useDeviceType(){
    const [deviceType, setDeviceType] = createSignal<"mobile" | "desktop">("desktop");

    const updateDeviceType = () => {
        setDeviceType(window.innerWidth <= 768 ? "mobile" : "desktop");
    };

    window.addEventListener("resize", updateDeviceType);
    updateDeviceType(); // Set initial device type

    return deviceType;
}