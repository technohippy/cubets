import { Vec3 } from "../math/vec3.js"
import { RGBAColor } from "../math/rgbacolor.js"

export class Light {
  direction: Vec3
  ambientColor: RGBAColor
  diffuseColor: RGBAColor

  constructor(direction:Vec3, ambientColor:RGBAColor, diffuseColor:RGBAColor) {
    this.direction = direction
    this.ambientColor = ambientColor
    this.diffuseColor = diffuseColor
  }
}