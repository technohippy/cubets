import { PhongLight } from "./phonglight.js";
import { RGBAColor } from "../../math/rgbacolor.js";
export class PhongPositionalLight extends PhongLight {
    constructor(position, ambientColor, diffuseColor, specularColor = RGBAColor.Gray) {
        super(ambientColor, diffuseColor, specularColor);
        this.position = position;
    }
    getGLVars(renderer) {
        const ret = super.getGLVars(renderer);
        const gl = renderer.gl;
        const cutoffLocation = renderer.getUniformLocation("uCutoff");
        const positionalLightLocation = renderer.getUniformLocation("uPositionalLight");
        const lightPositionLocation = renderer.getUniformLocation("uLightPosition");
        const lightDirectionLocation = renderer.getUniformLocation("uLightDirection");
        ret.push({ type: "1f", loc: cutoffLocation, value: 1 });
        ret.push({ type: "1i", loc: positionalLightLocation, value: 1 });
        ret.push({ type: "3f", loc: lightPositionLocation, value: this.position.toArray() });
        ret.push({ type: "3f", loc: lightDirectionLocation, value: [0, 0, 0] });
        return ret;
    }
}
