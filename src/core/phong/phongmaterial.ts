import { Material } from "../material.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";
import { CubeTexture } from "../cubetexture.js";

export class PhongMaterial extends Material {
  diffuseColor: RGBAColor
  ambientColor: RGBAColor
  specularColor: RGBAColor
  shininess: number

  constructor(
    diffuseColor: RGBAColor=RGBAColor.random(),
    ambientColor: RGBAColor=RGBAColor.Gray,
    specularColor: RGBAColor=RGBAColor.White,
    shininess: number = 100,
  ) {
    super()
    this.diffuseColor = diffuseColor
    this.ambientColor = ambientColor
    this.specularColor = specularColor
    this.shininess = shininess
  }

  setupGLVars(renderer:Renderer) {
    const gl = renderer.gl
    const wireframeModeLocation = renderer.getUniformLocation("uWireframeMode")
    const normalModeLocation = renderer.getUniformLocation("uNormalMode")
    const materialDiffuseLocation = renderer.getUniformLocation("uMaterialDiffuse")
    const materialAmbientLocation = renderer.getUniformLocation("uMaterialAmbient")
    const materialSpecularLocation = renderer.getUniformLocation("uMaterialSpecular")
    const shininessLocation = renderer.getUniformLocation("uShininess")
    gl.uniform1i(wireframeModeLocation, this.wireframe ? 1 : 0)
    gl.uniform1i(normalModeLocation, this.normal ? 1 : 0)
    gl.uniform4fv(materialDiffuseLocation, this.diffuseColor.toArray())
    gl.uniform4fv(materialAmbientLocation, this.ambientColor.toArray())
    gl.uniform4fv(materialSpecularLocation, this.specularColor.toArray())
    gl.uniform1f(shininessLocation, this.shininess)

    if (this.texture) {
      const samplerName = this.texture instanceof CubeTexture ? "uCubeSampler" : "uSampler"
      const samplerLocation = renderer.getUniformLocation(samplerName)
      this.texture.setupGLTexture(gl, samplerLocation)
    }
  }
}