import { Mesh } from "./mesh.js";
import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js";
export declare class Particles extends Mesh {
    setupGLBuffers(renderer: Renderer, scene: Scene): void;
    drawGL(gl: WebGL2RenderingContext): void;
}
//# sourceMappingURL=particles.d.ts.map