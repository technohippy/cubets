import { PhongLight } from "./phonglight.js";
import { RGBAColor } from "../../math/rgbacolor.js";
export class PhongDirectionalLight extends PhongLight {
    constructor(direction, ambientColor, diffuseColor, specularColor = RGBAColor.Gray) {
        super(ambientColor, diffuseColor, specularColor);
        this.direction = direction;
    }
    getGLVars(renderer) {
        const ret = super.getGLVars(renderer);
        const gl = renderer.gl;
        const cutoffLocation = renderer.getUniformLocation("uCutoff");
        const positionalLightLocation = renderer.getUniformLocation("uPositionalLight");
        const lightPositionLocation = renderer.getUniformLocation("uLightPosition");
        const lightDirectionLocation = renderer.getUniformLocation("uLightDirection");
        ret.push({ type: "1f", loc: cutoffLocation, value: 1 });
        ret.push({ type: "1i", loc: positionalLightLocation, value: 0 });
        ret.push({ type: "3f", loc: lightPositionLocation, value: [0, 0, 0] });
        ret.push({ type: "3f", loc: lightDirectionLocation, value: this.direction.toArray() });
        return ret;
    }
}
