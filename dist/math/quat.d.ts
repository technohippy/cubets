import { Transform3 } from "./transform3.js";
import { Vec3 } from "./vec3.js";
export declare class Quat {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    static fromEuler(x: number, y: number, z: number): Quat;
    static fromEulerDegrees(x: number, y: number, z: number): Quat;
    toArray(): number[];
    toTransform(center?: Vec3): Transform3;
}
//# sourceMappingURL=quat.d.ts.map