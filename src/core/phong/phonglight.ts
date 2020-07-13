import { Light } from "../light.js";
import { Vec3 } from "../../math/vec3.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";

export class PhongLight extends Light {
  shouldFollowCamera = false

  direction: Vec3
  ambientColor: RGBAColor
  diffuseColor: RGBAColor

  constructor(direction:Vec3, ambientColor:RGBAColor, diffuseColor:RGBAColor) {
    super()
    this.direction = direction
    this.ambientColor = ambientColor
    this.diffuseColor = diffuseColor
  }

  setupGLVars(renderer:Renderer) {
    const gl = renderer.gl
    const lightFollowCameraModeLocation = renderer.getUniformLocation("uLightFollowCameraMode")
    const lightDirectionLocation = renderer.getUniformLocation("uLightDirection")
    const lightAmbientLocation = renderer.getUniformLocation("uLightAmbient")
    const lightDiffuseLocation = renderer.getUniformLocation("uLightDiffuse")
    gl.uniform1i(lightFollowCameraModeLocation, this.shouldFollowCamera ? 1 : 0)
    gl.uniform3fv(lightDirectionLocation, this.direction.toArray())
    gl.uniform4fv(lightAmbientLocation, this.ambientColor.toArray())
    gl.uniform4fv(lightDiffuseLocation, this.diffuseColor.toArray())
  }
}