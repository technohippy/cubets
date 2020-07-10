import { Material } from "../material.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";

export class PhongMaterial extends Material {
  diffuseColor: RGBAColor

  constructor(diffuseColor: RGBAColor=RGBAColor.random()) {
    super()
    this.diffuseColor = diffuseColor
  }

  setupGLVars(renderer:Renderer) {
    const gl = renderer.gl
    const materialDiffuseLocation = renderer.getUniformLocation("uMaterialDiffuse")
    gl.uniform4fv(materialDiffuseLocation, this.diffuseColor.toArray())
  }
}