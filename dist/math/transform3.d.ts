import { Vec3 } from "./vec3.js";
export declare class Transform3 {
    #private;
    constructor(mat?: number[]);
    clone(): Transform3;
    static translate(amount: Vec3): Transform3;
    static rotate(rad: number, axis: Vec3): Transform3;
    static scale(scales: Vec3): Transform3;
    static scaleScalar(scale: number): Transform3;
    translate(amount: Vec3): Transform3;
    rotate(rad: number, axis: Vec3): Transform3;
    scale(scales: Vec3): Transform3;
    scaleScalar(scale: number): Transform3;
    multiply(that: Transform3): Transform3;
    apply(vec: Vec3): void;
}
//# sourceMappingURL=transform3.d.ts.map