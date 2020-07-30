import { Vec3 } from "./vec3.js";
export declare class Face3 {
    p1: number;
    p2: number;
    p3: number;
    constructor(p1: number, p2: number, p3: number);
    normal(vertices: Vec3[]): Vec3;
    toArray(): number[];
    toLineArray(): number[];
}
//# sourceMappingURL=face3.d.ts.map