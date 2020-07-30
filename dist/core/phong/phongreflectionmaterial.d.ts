import { Mesh } from "../mesh.js";
import { Renderer } from "../renderer.js";
import { Scene } from "../scene.js";
import { Camera } from "../camera.js";
import { PhongMaterial } from "./phongmaterial.js";
export declare class PhongReflectionMaterial extends PhongMaterial {
    reflectionScene?: Scene;
    reflectionCamera?: Camera;
    prepare(renderer: Renderer, mesh: Mesh): void;
    setupGLVars(renderer: Renderer, mesh: Mesh): void;
    createFrameBuffer(gl: WebGL2RenderingContext, size?: number): {
        frameBuffer: WebGLFramebuffer;
        cubeTexture: WebGLTexture;
    };
}
//# sourceMappingURL=phongreflectionmaterial.d.ts.map