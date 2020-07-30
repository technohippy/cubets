import { Camera } from "../core/camera.js";
import { Viewport } from "../core/viewport.js";
export declare class PerspectiveCamera extends Camera {
    fov: number;
    near: number;
    far: number;
    constructor(viewport: Viewport | string, fov: number, near: number, far: number);
    setupProjectionMatrix(): void;
}
//# sourceMappingURL=perspectivecamera.d.ts.map