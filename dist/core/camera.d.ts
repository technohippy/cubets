import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js";
import { Filter, FilterChain } from "./filter.js";
import { Vec3 } from "../math/vec3.js";
import { Quat } from "../math/quat.js";
import { CameraControl } from "../control/cameracontrol.js";
import { Viewport } from "./viewport.js";
import { Picker } from "./picker.js";
export interface FilteredCamera {
    resetFilters(): void;
    applyFilters(renderer: Renderer, fn: () => void): void;
    setupGLMatrixes(renderer: Renderer, scene: Scene): void;
}
export declare abstract class Camera implements FilteredCamera {
    #private;
    renderer: Renderer;
    filters: FilterChain;
    projectionMatrix: number[];
    modelViewMatrix: number[];
    normalMatrix: number[];
    controls: CameraControl[];
    picker?: Picker;
    position: Vec3;
    rotation: Quat;
    up: Vec3;
    target?: Vec3;
    constructor(viewport: Viewport | string);
    getAspectRatio(): number;
    addControl(control: CameraControl): void;
    setPicker(picker: Picker): void;
    removeControl(control: CameraControl): void;
    followTarget(target: Vec3): void;
    resetTarget(): void;
    addFilter(filter: Filter): void;
    removeFilter(filter: Filter): void;
    resetFilters(): void;
    applyFilters(renderer: Renderer, fn: () => void): void;
    setupGLMatrixes(renderer: Renderer, scene: Scene): void;
    abstract setupProjectionMatrix(): void;
    setupModelViewMatrix(): void;
    draw(scene: Scene): void;
    start(scene: Scene, loop?: boolean): Promise<void>;
    startOnce(scene: Scene): void;
    stop(): void;
    private _anim;
}
//# sourceMappingURL=camera.d.ts.map