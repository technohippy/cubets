import { Vec2 } from "../math/vec2.js";
import { Vec3 } from "../math/vec3.js";
import { Camera } from "../core/camera.js";
import { PolarCoord } from "../math/polarcoord.js";
import { CameraControl } from "./cameracontrol.js";
export declare class OrbitCameraControl extends CameraControl {
    target: Vec3;
    initialRadius?: number;
    cameraPolarCoord?: PolarCoord;
    moving: boolean;
    prevPoints: Vec2[];
    mousedownEvent?: (this: HTMLElement, ev: MouseEvent) => any;
    mouseupEvent?: (this: HTMLElement, ev: MouseEvent) => any;
    mouseleaveEvent?: (this: HTMLElement, ev: MouseEvent) => any;
    mousemoveEvent?: (this: HTMLElement, ev: MouseEvent) => any;
    mousewheelEventListener?: (this: HTMLElement, ev: MouseEvent) => any;
    touchstartEvent?: (this: HTMLElement, ev: TouchEvent) => any;
    touchendEvent?: (this: HTMLElement, ev: TouchEvent) => any;
    touchmoveEvent?: (this: HTMLElement, ev: TouchEvent) => any;
    constructor(target?: Vec3, container?: string | HTMLElement);
    setCamera(camera: Camera): void;
    attachEvents(): void;
    detachEvents(): void;
    private _setupEvents;
    private _update;
}
//# sourceMappingURL=orbitcameracontrol.d.ts.map