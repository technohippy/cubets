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
    const wireframeLocation = renderer.getUniformLocation("uWireframe")
    const normalLocation = renderer.getUniformLocation("uNormal")
    const materialDiffuseLocation = renderer.getUniformLocation("uMaterialDiffuse")
    gl.uniform1i(wireframeLocation, this.wireframe ? 1 : 0)
    gl.uniform1i(normalLocation, this.normal ? 1 : 0)
    gl.uniform4fv(materialDiffuseLocation, this.diffuseColor.toArray())
  }
}