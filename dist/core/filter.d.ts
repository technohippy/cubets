import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js";
import { Material } from "./material.js";
import { PlaneGeometry } from "../geometry/planegeometry.js";
import { Mesh } from "../core/mesh.js";
import { RGBAColor } from "../math/rgbacolor.js";
import { RenderTarget } from "./rendertarget.js";
export declare abstract class Filter {
    scene: Scene;
    plane: PlaneGeometry;
    planeMesh: Mesh;
    renderer?: Renderer;
    inputRenderTarget?: RenderTarget;
    outputRenderTarget?: RenderTarget;
    constructor(scene: FilterScene | string, material?: FilterMaterial);
    setupRenderTarget(parentRenderer: Renderer): void;
    resetFrameBuffer(): void;
    draw(): void;
}
export declare class FilterChain {
    filters: Filter[];
    push(filter: Filter): void;
    forEach(fn: (filter: Filter) => void): void;
    apply(parentRenderer: Renderer, fn: () => void): void;
}
export declare class FilterMaterial extends Material {
    filter?: Filter;
    setColor(color: RGBAColor): void;
    prepare(renderer: Renderer, mesh: Mesh): void;
    setupGLVars(renderer: Renderer): void;
}
export declare class FilterScene extends Scene {
    static Material: typeof FilterMaterial;
    fragmentShaderBodyFn?: (fragColor: string, frameColor: string) => string;
    constructor(fragmentShaderBodyFn?: (fragColor: string, frameColor: string) => string);
    hasTexture(): boolean;
    getVertexPositionAttribLocation(renderer: Renderer): number;
    getVertexNormalAttribLocation(renderer: Renderer): number;
    getVertexColorAttribLocation(renderer: Renderer): number;
    getVertexOffsetAttribLocation(renderer: Renderer): number;
    getVertexQuatAttribLocation(renderer: Renderer): number;
    getVertexTangentAttribLocation(renderer: Renderer): number;
    getVertexTextureCoordsAttribLocation(renderer: Renderer): number;
    getProjectionMatrixUniformLocation(renderer: Renderer): WebGLUniformLocation | null;
    getModelViewMatrixUniformLocation(renderer: Renderer): WebGLUniformLocation | null;
    getNormalMatrixUniformLocation(renderer: Renderer): WebGLUniformLocation | null;
    getAttributeNames(): string[];
    getUniformNames(): string[];
    getVertexShader(): string;
    getFragmentShader(): string;
    getFragmentShaderHead(): string;
    getFragmentShaderBody(fragColor: string, frameColor: string): string;
}
//# sourceMappingURL=filter.d.ts.map