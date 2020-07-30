import { Vec3 } from "../../math/vec3.js";
import { BoidsWorld } from "./boidsworld.js";
import { Scene } from "../../core/scene.js";
import { Camera } from "../../core/camera.js";
import { InstancedMesh } from "../../core/instancedmesh.js";
export declare class BoidsApp {
    world: BoidsWorld;
    scene: Scene;
    camera: Camera;
    boidsMeshes?: InstancedMesh;
    constructor(canvasId: string, size: Vec3, boidsCount: number, flockCount?: number);
    setup(imagePath: string): Promise<void>;
    start(): void;
}
//# sourceMappingURL=boidsapp.d.ts.map