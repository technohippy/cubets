import { PhongLight } from "./phonglight.js";
import { Vec3 } from "../math/vec3.js";
import { RGBAColor } from "../math/rgbacolor.js";

export class PhongPositionalLight extends PhongLight {
  constructor(position:Vec3, diffuse:RGBAColor, ambient:RGBAColor, specular:RGBAColor=RGBAColor.Gray) {
    super(diffuse, ambient, specular)
    this.type = "positional"
    this.position = position
  }
}