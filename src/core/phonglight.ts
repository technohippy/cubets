import { Light } from "./light.js";
import { Vec3 } from "../math/vec3.js";
import { RGBAColor } from "../math/rgbacolor.js";

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
}