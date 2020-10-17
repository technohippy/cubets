import { PhongLight } from "./phonglight.js";
import { Vec3 } from "../math/vec3.js";
import { RGBAColor } from "../math/rgbacolor.js";

export class PhongSpotLight extends PhongLight {
  constructor(position:Vec3, direction:Vec3, diffuse:RGBAColor, ambient:RGBAColor, specular:RGBAColor=RGBAColor.Gray) {
    super(diffuse, ambient, specular)
    this.type = "spot"
    this.cutoff = 30
    this.position = position
    this.direction = direction
  }
}