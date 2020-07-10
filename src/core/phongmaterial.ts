import { Material } from "./material.js";
import { RGBAColor } from "../math/rgbacolor.js";

export class PhongMaterial extends Material {
  diffuseColor: RGBAColor

  constructor(diffuseColor: RGBAColor=RGBAColor.random()) {
    super()
    this.diffuseColor = diffuseColor
  }
}