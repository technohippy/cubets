import { Scene } from "./scene.js";
import { FilteredCamera } from "./camera.js";
import { Mesh } from "./mesh.js";
import { Viewport } from "./viewport.js";
import { RGBAColor } from "../math/rgbacolor.js";
import { Material } from "./material.js";
import { RenderTarget } from "./rendertarget.js";
export declare class Renderer {
    container?: HTMLCanvasElement;
    viewport: Viewport;
    gl: WebGL2RenderingContext;
    vao?: WebGLVertexArrayObject;
    renderTarget: RenderTarget;
    program?: WebGLProgram;
    attributeLocations: Map<string, number>;
    uniformLocations: Map<string, WebGLUniformLocation>;
    overrideMaterial?: Material;
    constructor(viewport: Viewport);
    renew(): Renderer;
    copyGLCachesFrom(renderer: Renderer): void;
    getAspectRatio(): number;
    prepareProgram(scene: Scene): void;
    setupLocations(scene: Scene): void;
    use(): void;
    prepareRender(scene: Scene): void;
    prepareMeshMaterial(scene: Scene): void;
    render(scene: Scene, camera: FilteredCamera): void;
    clear(clearColor: RGBAColor | undefined, camera: FilteredCamera): void;
    setupVAO(scene: Scene, mesh: Mesh): void;
    renderMesh(scene: Scene, mesh: Mesh, camera: FilteredCamera): void;
    getAttributeLocation(name: string, ignoreError?: boolean): number;
    getUniformLocation(name: string, ignoreError?: boolean): WebGLUniformLocation | null;
}
//# sourceMappingURL=renderer.d.ts.map