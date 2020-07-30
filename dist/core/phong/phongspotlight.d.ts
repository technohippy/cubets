import { PhongLight } from "./phonglight.js";
import { Vec3 } from "../../math/vec3.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";
export declare class PhongSpotLight extends PhongLight {
    position: Vec3;
    direction: Vec3;
    cutoff: number;
    constructor(position: Vec3, direction: Vec3, ambientColor: RGBAColor, diffuseColor: RGBAColor, specularColor?: RGBAColor);
    getGLVars(renderer: Renderer): {
        type: string;
        loc: WebGLUniformLocation;
        value: any;
    }[];
}
//# sourceMappingURL=phongspotlight.d.ts.map