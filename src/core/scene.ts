import { Mesh } from './mesh.js'
import { Light } from './light.js'
import { Lights } from './lights.js'
import { Renderer } from './renderer.js'
import { Texture } from './texture.js'
import { RGBAColor } from '../math/rgbacolor.js'
import { CubeTexture } from './cubetexture.js'
import { PhongReflectionMaterial } from './phong/phongreflectionmaterial.js'

export abstract class Scene {
  name?: string
  clearColor = RGBAColor.Black

  meshes: Mesh[] = []
  reflectionMeshes: Mesh[] = []
  lights = new Lights()

  #textures?: Texture[]

  add(obj: Mesh | Light) {
    if (obj instanceof Mesh) {
      this.addMesh(obj)
    } else if (obj instanceof Light) {
      this.addLight(obj)
    }
  }

  addMesh(mesh: Mesh) {
    // TODO: PhongReflectionMaterial が漏れているのでどうにかする
    if (mesh.material instanceof PhongReflectionMaterial) {
      this.reflectionMeshes.push(mesh)
    } else {
      this.meshes.push(mesh)
    }
  }

  addLight(light: Light) {
    this.lights.push(light)
  }

  each(fn: (obj: Mesh | Light) => void) {
    this.eachMesh(fn)
    this.eachLight(fn)
  }

  eachMesh(fn: (obj: Mesh) => void) {
    this.meshes.forEach(fn)
    this.reflectionMeshes.forEach(fn)
  }

  eachLight(fn: (obj: Light) => void) {
    this.lights.forEach(fn)
  }

  collectTextures(): Texture[] {
    if (this.#textures === undefined) {
      this.#textures = []
      this.eachMesh(m => {
        const tex = m.material.texture
        if (tex) this.#textures?.push(tex)
      })
    }
    return this.#textures
  }

  hasTexture(): boolean {
    const textures = this.collectTextures()
    for (let i = 0; i < textures.length; i++) {
      const texture = textures[i]
      if (texture instanceof CubeTexture) {
        // ignore
      } else if (texture instanceof Texture) {
        return true
      }
    }
    return false
  }

  hasCubeTexture(): boolean {
    const textures = this.collectTextures()
    for (let i = 0; i < textures.length; i++) {
      const texture = textures[i]
      if (texture instanceof CubeTexture) {
        return true
      }
    }
    return false
  }

  async loadAllTextures(): Promise<void[]> {
    return Promise.all(this.collectTextures().map(t => t.loadImage()))
  }

  abstract getVertexShader():string
  abstract getFragmentShader():string

  abstract getVertexPositionAttribLocation(renderer:Renderer): number
  abstract getVertexNormalAttribLocation(renderer:Renderer): number
  abstract getVertexTextureCoordsAttribLocation(renderer:Renderer): number

  abstract getProjectionMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation
  abstract getModelViewMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation
  abstract getNormalMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation

  abstract getAttributeNames(): string[]

  abstract getUniformNames(): string[]
}