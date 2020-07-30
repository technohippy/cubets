import { PolarCoord } from "./polarcoord.js";
export declare class Vec3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    copy(v: Vec3): Vec3;
    clone(): Vec3;
    translate(amount: Vec3): void;
    rotate(rad: number, axis: Vec3): void;
    cross(vec: Vec3): Vec3;
    add(vec: Vec3): Vec3;
    subtract(vec: Vec3): Vec3;
    multiplyScalar(val: number): Vec3;
    divideScalar(val: number): Vec3;
    negate(): Vec3;
    length(): number;
    distance(that: Vec3): number;
    normalize(): Vec3;
    angleTo(v: Vec3): number;
    toArray(): number[];
    fromArray(values: number[]): void;
    asArray(fn: (vals: number[]) => number[]): void;
    toPolar(): PolarCoord;
    fromPolar(polar: PolarCoord): Vec3;
}
//# sourceMappingURL=vec3.d.ts.map