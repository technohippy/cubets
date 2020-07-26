import { Material } from "../material.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";
import { Mesh } from "../mesh.js";

export class PhongMaterial extends Material {
  diffuseColor: RGBAColor
  ambientColor: RGBAColor
  specularColor: RGBAColor
  shininess: number

  pointSize?: number // only for particles

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
    gl.uniform1i(vertexColorModeLocation, mesh.geometry.hasVertexColors() ? 1 : 0)
    gl.uniform4fv(materialDiffuseLocation, this.diffuseColor.toArray())
    gl.uniform4fv(materialAmbientLocation, this.ambientColor.toArray())
    gl.uniform4fv(materialSpecularLocation, this.specularColor.toArray())
    gl.uniform1f(shininessLocation, this.shininess)

    // particles
    if (this.pointSize) {
      const pointSizeLocation = renderer.getUniformLocation("uPointSize")
      gl.uniform1f(pointSizeLocation, this.pointSize)
    }

    // texture
    let ignoreTextureLocation = renderer.getUniformLocation("uIgnoreTexture", true)
    let ignoreNormalTextureLocation = renderer.getUniformLocation("uIgnoreNormalTexture", true)
    let ignoreCubeTextureLocation = renderer.getUniformLocation("uIgnoreCubeTexture", true)
    const ignoreFlags = { texture: 1, normal: 1, cube: 1 }
    let textureUnit = 0
    this.textures.forEach(texture => {
      const samplerLocation = renderer.getUniformLocation("uSampler")
      texture.setupGLTexture(gl, samplerLocation!, textureUnit++)
      ignoreFlags.texture = 0
    })
    if (this.normalTexture) {
      const samplerLocation = renderer.getUniformLocation("uNormalSampler")
      this.normalTexture.setupGLTexture(gl, samplerLocation!, textureUnit++)
      ignoreFlags.normal = 0
    }
    if (this.cubeTexture) {
      const skyboxLocation = renderer.getUniformLocation("uSkybox")
      const samplerLocation = renderer.getUniformLocation("uCubeSampler")
      this.cubeTexture.setupGLTexture(gl, samplerLocation!, skyboxLocation!)
      ignoreFlags.cube = 0
    }
    if (ignoreTextureLocation) gl.uniform1i(ignoreTextureLocation, ignoreFlags.texture)
    if (ignoreNormalTextureLocation) gl.uniform1i(ignoreNormalTextureLocation, ignoreFlags.normal)
    if (ignoreCubeTextureLocation) gl.uniform1i(ignoreCubeTextureLocation, ignoreFlags.cube)
  }
}