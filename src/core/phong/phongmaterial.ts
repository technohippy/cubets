import { Material } from "../material.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";

export class PhongMaterial extends Material {
  diffuseColor: RGBAColor
  ambientColor: RGBAColor
  specularColor: RGBAColor

  constructor(diffuseColor: RGBAColor=RGBAColor.random(), ambientColor: RGBAColor=RGBAColor.White, specularColor: RGBAColor=RGBAColor.White) {
    super()
    this.diffuseColor = diffuseColor
    this.ambientColor = new RGBAColor(1, 1, 1)
    this.specularColor = new RGBAColor(1, 1, 1)
  }

  setupGLVars(renderer:Renderer) {
    const gl = renderer.gl
    const wireframeModeLocation = renderer.getUniformLocation("uWireframeMode")
    const normalModeLocation = renderer.getUniformLocation("uNormalMode")
    const materialDiffuseLocation = renderer.getUniformLocation("uMaterialDiffuse")
    const materialAmbientLocation = renderer.getUniformLocation("uMaterialAmbient")
    const materialSpecularLocation = renderer.getUniformLocation("uMaterialSpecular")
    gl.uniform1i(wireframeModeLocation, this.wireframe ? 1 : 0)
    gl.uniform1i(normalModeLocation, this.normal ? 1 : 0)
    gl.uniform4fv(materialDiffuseLocation, this.diffuseColor.toArray())
    gl.uniform4fv(materialAmbientLocation, this.ambientColor.toArray())
    gl.uniform4fv(materialSpecularLocation, this.specularColor.toArray())
  }
}