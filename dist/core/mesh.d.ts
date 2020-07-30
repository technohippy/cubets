import { Geometry } from "./geometry.js";
import { Material } from "./material.js";
import { Transform3 } from "../math/transform3.js";
import { Vec3 } from "../math/vec3.js";
import { Quat } from "../math/quat.js";
import { Scene } from "./scene.js";
import { Renderer } from "./renderer.js";
export declare class Mesh {
    static currentId: number;
    id: number;
    hidden: boolean;
    parent?: Mesh;
    children: Mesh[];
    localPosition: Vec3;
    geometry: Geometry;
    material: Material;
    position: Vec3;
    rotation: Quat;
    transforms: Transform3[];
    basePosition: Vec3;
    verticesBuffer?: WebGLBuffer;
    indicesBuffer?: WebGLBuffer;
    normalBuffer?: WebGLBuffer;
    colorBuffer?: WebGLBuffer;
    tangentBuffer?: WebGLBuffer;
    textureCoordsBuffer?: WebGLBuffer;
    constructor(geometry: Geometry, material: Material);
    add(mesh: Mesh, localPosition?: Vec3): void;
    forEachChild(fn: (child: Mesh) => void): void;
    getTransform(): Transform3;
    translate(amount: Vec3): void;
    rotate(rad: number, axis: Vec3): void;
    scale(scale: number): void;
    resetTransform(): void;
    hasTexture(): boolean;
    hasCubeTexture(): boolean;
    setupGLBuffers(renderer: Renderer, scene: Scene, ignoreTransform?: boolean): void;
    drawGL(gl: WebGL2RenderingContext): void;
    private _concentrateMatrixes;
}
//# sourceMappingURL=mesh.d.ts.map