import { Light } from "../light.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";
export declare abstract class PhongLight extends Light {
    shouldFollowCamera: boolean;
    ambientColor: RGBAColor;
    diffuseColor: RGBAColor;
    specularColor: RGBAColor;
    constructor(ambientColor: RGBAColor, diffuseColor: RGBAColor, specularColor?: RGBAColor);
    getGLVars(renderer: Renderer): {
        type: string;
        loc: WebGLUniformLocation;
        value: any;
    }[];
}
//# sourceMappingURL=phonglight.d.ts.map