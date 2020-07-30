import { Vec3 } from "../../math/vec3.js";
import { Boid } from "./boid.js";
export declare class BoidsWorld {
    size: Vec3;
    center: Vec3;
    boids: Boid[];
    constructor(size: Vec3, boidsCount: number, flockCount?: number, center?: Vec3);
    getBoidsInFov(center: Boid, fov: number, maxAngle: number, sameFlock: boolean): Boid[];
    step(): void;
}
//# sourceMappingURL=boidsworld.d.ts.map