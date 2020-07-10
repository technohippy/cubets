import { Light } from "../light.js";
import { Vec3 } from "../../math/vec3.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Scene } from "../scene.js";

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

  setupGLVars(gl:WebGL2RenderingContext, scene:Scene) {
    const lightDirectionLocation = scene.getUniformLocation("uLightDirection")
    const lightAmbientLocation = scene.getUniformLocation("uLightAmbient")
    const lightDiffuseLocation = scene.getUniformLocation("uLightDiffuse")
    gl.uniform3fv(lightDirectionLocation, this.direction.toArray())
    gl.uniform4fv(lightAmbientLocation, this.ambientColor.toArray())
    gl.uniform4fv(lightDiffuseLocation, this.diffuseColor.toArray())
  }
}