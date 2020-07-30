import { Scene } from "./scene.js";
import { Camera } from "./camera.js";
import { Mesh } from "./mesh.js";
import { Renderer } from "./renderer.js";
import { RenderTarget } from "./rendertarget.js";
export declare class Picker {
    camera?: Camera;
    scene?: Scene;
    container?: HTMLCanvasElement;
    renderer?: Renderer;
    handler: (mesh: Mesh) => void;
    renderTarget?: RenderTarget;
    constructor(handler: (mesh: Mesh) => void);
    setup(camera: Camera, scene: Scene): void;
    pickObject(x: number, y: number): void;
    setupFrameBuffer(gl: WebGL2RenderingContext): void;
    resetFrameBuffer(gl: WebGL2RenderingContext): void;
}
//# sourceMappingURL=picker.d.ts.map