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
    const wireframeModeLocation = renderer.getUniformLocation("uWireframeMode")
    const normalModeLocation = renderer.getUniformLocation("uNormalMode")
    const materialDiffuseLocation = renderer.getUniformLocation("uMaterialDiffuse")
    gl.uniform1i(wireframeModeLocation, this.wireframe ? 1 : 0)
    gl.uniform1i(normalModeLocation, this.normal ? 1 : 0)
    gl.uniform4fv(materialDiffuseLocation, this.diffuseColor.toArray())
  }
}