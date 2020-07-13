import { Material } from "../material.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";

export class PhongMaterial extends Material {
  diffuseColor: RGBAColor
  ambientColor: RGBAColor
  specularColor: RGBAColor

  constructor(
    diffuseColor: RGBAColor=RGBAColor.random(),
    ambientColor: RGBAColor=RGBAColor.Gray,
    specularColor: RGBAColor=RGBAColor.White
  ) {
    super()
    this.diffuseColor = diffuseColor
    this.ambientColor = ambientColor
    this.specularColor = specularColor
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