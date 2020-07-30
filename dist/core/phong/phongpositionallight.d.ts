import { PhongLight } from "./phonglight.js";
import { Vec3 } from "../../math/vec3.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";
export declare class PhongPositionalLight extends PhongLight {
    position: Vec3;
    constructor(position: Vec3, ambientColor: RGBAColor, diffuseColor: RGBAColor, specularColor?: RGBAColor);
    getGLVars(renderer: Renderer): {
        type: string;
        loc: WebGLUniformLocation;
        value: any;
    }[];
}
//# sourceMappingURL=phongpositionallight.d.ts.map