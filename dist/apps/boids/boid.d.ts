import { Vec3 } from "../../math/vec3.js";
import { BoidsWorld } from "./boidsworld.js";
export declare class Boid {
    world: BoidsWorld;
    flock: number;
    position: Vec3;
    velocity: Vec3;
    constructor(world: BoidsWorld, flock: number, position?: Vec3, velocity?: Vec3);
    step(): void;
}
//# sourceMappingURL=boid.d.ts.map