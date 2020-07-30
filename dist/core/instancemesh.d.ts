import { Geometry } from "./geometry.js";
import { Material } from "./material.js";
import { Mesh } from "./mesh.js";
import { Vec3 } from "../math/vec3.js";
import { Transform3 } from "../math/transform3.js";
import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js";
export declare class InstancedMesh extends Mesh {
    meshes: Mesh[];
    constructor(instanceCount: number, geometry: Geometry, material: Material);
    add(mesh: Mesh, localPosition?: Vec3): void;
    forEachChild(fn: (child: Mesh) => void): void;
    getTransform(): Transform3;
    translate(amount: Vec3): void;
    rotate(rad: number, axis: Vec3): void;
    scale(scale: number): void;
    resetTransform(): void;
    hasTexture(): boolean;
    hasCubeTexture(): boolean;
    setupGLBuffers(renderer: Renderer, scene: Scene): void;
    drawGL(gl: WebGL2RenderingContext): void;
}
//# sourceMappingURL=instancemesh.d.ts.map