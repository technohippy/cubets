import { Light } from "../light.js";
import { Vec3 } from "../../math/vec3.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";

export class PhongLight extends Light {
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
    const lightDirectionLocation = renderer.getUniformLocation("uLightDirection")
    const lightAmbientLocation = renderer.getUniformLocation("uLightAmbient")
    const lightDiffuseLocation = renderer.getUniformLocation("uLightDiffuse")
    gl.uniform3fv(lightDirectionLocation, this.direction.toArray())
    gl.uniform4fv(lightAmbientLocation, this.ambientColor.toArray())
    gl.uniform4fv(lightDiffuseLocation, this.diffuseColor.toArray())
  }
}