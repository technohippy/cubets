import { PhongLight } from "./phonglight.js";
import { Vec3 } from "../../math/vec3.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";
export declare class PhongDirectionalLight extends PhongLight {
    direction: Vec3;
    constructor(direction: Vec3, ambientColor: RGBAColor, diffuseColor: RGBAColor, specularColor?: RGBAColor);
    getGLVars(renderer: Renderer): {
        type: string;
        loc: WebGLUniformLocation;
        value: any;
    }[];
}
//# sourceMappingURL=phongdirectionallight.d.ts.map