import { Camera } from "../core/camera.js";
import { Viewport } from "../core/viewport.js";
export declare class OrthogonalCamera extends Camera {
    left: number;
    right: number;
    bottom: number;
    top: number;
    near: number;
    far: number;
    constructor(viewport: Viewport | string, width: number, near: number, far: number);
    setupProjectionMatrix(): void;
}
//# sourceMappingURL=orthogonalcamera.d.ts.map