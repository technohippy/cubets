import { Camera } from "../core/camera.js";
export declare abstract class CameraControl {
    camera?: Camera;
    container?: HTMLElement;
    setCamera(camera: Camera): void;
    abstract attachEvents(): void;
    abstract detachEvents(): void;
    protected _clamp(val: number, min: number, max: number): number;
}
//# sourceMappingURL=cameracontrol.d.ts.map