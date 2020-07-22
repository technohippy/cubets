import { Material } from "../material.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";
import { CubeTexture } from "../cubetexture.js";
import { Mesh } from "../mesh.js";

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

  prepare(renderer:Renderer, mesh:Mesh) {}

  setupGLVars(renderer:Renderer, mesh:Mesh) {
    const gl = renderer.gl
    const wireframeModeLocation = renderer.getUniformLocation("uWireframeMode")
    const normalModeLocation = renderer.getUniformLocation("uNormalMode")
    const vertexColorModeLocation = renderer.getUniformLocation("uVertexColorMode")
    const materialDiffuseLocation = renderer.getUniformLocation("uMaterialDiffuse")
    const materialAmbientLocation = renderer.getUniformLocation("uMaterialAmbient")
    const materialSpecularLocation = renderer.getUniformLocation("uMaterialSpecular")
    const shininessLocation = renderer.getUniformLocation("uShininess")
    gl.uniform1i(wireframeModeLocation, this.wireframe ? 1 : 0)
    gl.uniform1i(normalModeLocation, this.normal ? 1 : 0)
    gl.uniform1i(vertexColorModeLocation, 0 < mesh.geometry.colors.length ? 1 : 0)
    gl.uniform4fv(materialDiffuseLocation, this.diffuseColor.toArray())
    gl.uniform4fv(materialAmbientLocation, this.ambientColor.toArray())
    gl.uniform4fv(materialSpecularLocation, this.specularColor.toArray())
    gl.uniform1f(shininessLocation, this.shininess)

    // texture
    let ignoreTextureLocation = renderer.getUniformLocation("uIgnoreTexture", true)
    let ignoreCubeTextureLocation = renderer.getUniformLocation("uIgnoreCubeTexture", true)
    if (this.texture) {
      if (this.texture instanceof CubeTexture) {
        const skyboxLocation = renderer.getUniformLocation("uSkybox")
        const samplerLocation = renderer.getUniformLocation("uCubeSampler")
        this.texture.setupGLTexture(gl, samplerLocation!, skyboxLocation!)

        if (ignoreTextureLocation) gl.uniform1i(ignoreTextureLocation, 1)
        if (ignoreCubeTextureLocation) gl.uniform1i(ignoreCubeTextureLocation, 0)
      } else {
        const samplerLocation = renderer.getUniformLocation("uSampler")
        this.texture.setupGLTexture(gl, samplerLocation!)

        if (ignoreTextureLocation) gl.uniform1i(ignoreTextureLocation, 0)
        if (ignoreCubeTextureLocation) gl.uniform1i(ignoreCubeTextureLocation, 1)
      }
    } else {
      if (ignoreTextureLocation) gl.uniform1i(ignoreTextureLocation, 1)
      if (ignoreCubeTextureLocation) gl.uniform1i(ignoreCubeTextureLocation, 1)
    }
  }
}