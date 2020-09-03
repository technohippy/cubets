import { Material } from "./material.js";
import { RGBAColor } from "../math/rgbacolor.js";
import { GLContext } from "../gl/glcontext.js";
import { GLUniform } from "../gl/gluniform.js";

type PhongMaterialConfigKey = "diffuse" | "ambient" | "specular" | "shininess"
export type PhongMaterialConfig = {[key in PhongMaterialConfigKey]?:GLUniform}

export class PhongMaterial extends Material {
  diffuseColor: RGBAColor
  ambientColor: RGBAColor
  specularColor: RGBAColor
  shininess: number
  pointSize?: number // only for particles

  diffuseColorUniform?:GLUniform
  ambientColorUniform?:GLUniform
  specularColorUniform?:GLUniform
  shininessUniform?:GLUniform
  
  #uploaded = false

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

  setupContextVars(config:PhongMaterialConfig) {
    this.diffuseColorUniform = config["diffuse"]
    this.ambientColorUniform = config["ambient"]
    this.specularColorUniform = config["specular"]
    this.shininessUniform = config["shininess"]
  }

  writeContext(context:GLContext) {
    this.diffuseColorUniform?.updateValue(this.diffuseColor.toArray())
    this.ambientColorUniform?.updateValue(this.ambientColor.toArray())
    this.specularColorUniform?.updateValue(this.specularColor.toArray())
    this.shininessUniform?.updateValue(this.shininess)
    if (!this.#uploaded) {
      if (this.diffuseColorUniform) {
        context.addUniform(this.diffuseColorUniform)
      }
      if (this.ambientColorUniform) {
        context.addUniform(this.ambientColorUniform)
      }
      if (this.specularColorUniform) {
        context.addUniform(this.specularColorUniform)
      }
      if (this.shininessUniform) {
        context.addUniform(this.shininessUniform)
      }
      this.#uploaded = true
    }
  }

  /*
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
  */
}