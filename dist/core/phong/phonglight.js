import { Light } from "../light.js";
import { RGBAColor } from "../../math/rgbacolor.js";
export class PhongLight extends Light {
    constructor(ambientColor, diffuseColor, specularColor = RGBAColor.Gray) {
        super();
        this.shouldFollowCamera = false;
        this.ambientColor = ambientColor;
        this.diffuseColor = diffuseColor;
        this.specularColor = specularColor;
    }
    getGLVars(renderer) {
        const ret = [];
        const gl = renderer.gl;
        const lightFollowCameraModeLocation = renderer.getUniformLocation("uLightFollowCameraMode");
        const lightAmbientLocation = renderer.getUniformLocation("uLightAmbient");
        const lightDiffuseLocation = renderer.getUniformLocation("uLightDiffuse");
        const lightSpecularLocation = renderer.getUniformLocation("uLightSpecular");
        ret.push({ type: "1i", loc: lightFollowCameraModeLocation, value: this.shouldFollowCamera ? 1 : 0 });
        ret.push({ type: "4f", loc: lightAmbientLocation, value: this.ambientColor.toArray() });
        ret.push({ type: "4f", loc: lightDiffuseLocation, value: this.diffuseColor.toArray() });
        ret.push({ type: "4f", loc: lightSpecularLocation, value: this.specularColor.toArray() });
        return ret;
    }
}
