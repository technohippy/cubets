import { Mesh } from './mesh.js'
import { Light } from './light.js'
import { Lights } from './lights.js'
import { Renderer } from './renderer.js'
import { Texture, TextureType } from './texture.js'
import { RGBAColor } from '../math/rgbacolor.js'
import { PhongReflectionMaterial } from './phong/phongreflectionmaterial.js'
import { Particles } from './particles.js'

export abstract class Scene {
  name?: string
  clearColor = RGBAColor.Black

  meshes: Mesh[] = []
  reflectionMeshes: Mesh[] = []
  lights = new Lights()

  #textures?: Texture[]

  add(...objs: (Mesh | Light)[]) {
    objs.forEach(obj => {
      if (obj instanceof Mesh) {
        this.addMesh(obj)
      } else if (obj instanceof Light) {
        this.addLight(obj)
      }
    })
  }

  addMesh(...meshes: Mesh[]) {
    meshes.forEach(mesh => {
      // TODO: PhongReflectionMaterial が漏れているのでどうにかする
      if (mesh.material instanceof PhongReflectionMaterial) {
        this.reflectionMeshes.push(mesh)
      } else {
        this.meshes.push(mesh)
      }
    })
  }

  addLight(...lights: Light[]) {
    lights.forEach(light => this.lights.push(light))
  }

  each(fn: (obj: Mesh | Light) => void) {
    this.eachMesh(fn)
    this.eachLight(fn)
  }

  eachMesh(fn: (mesh:Mesh) => void) {
    this.meshes.forEach(m => {
      m.forEachChild(fn)
      fn(m)
    })
    this.reflectionMeshes.forEach(m => {
      m.forEachChild(fn)
      fn(m)
    })
  }

  eachLight(fn: (obj: Light) => void) {
    this.lights.forEach(fn)
  }

  collectTextures(): Texture[] {
    if (this.#textures === undefined) {
      this.#textures = []
      this.eachMesh(mesh => {
        this.#textures?.push(...mesh.material.textures)

        const ntex = mesh.material.normalTexture
        if (ntex) this.#textures?.push(ntex)

        const ctex = mesh.material.cubeTexture
        if (ctex) this.#textures?.push(ctex)
      })
    }
    return this.#textures
  }

  hasTextureType(type: TextureType): boolean {
    const textures = this.collectTextures()
    for (let i = 0; i < textures.length; i++) {
      const texture = textures[i]
      if (texture.type === type) {
        return true
      }
    }
    return false
  }

  hasTexture(): boolean {
    return this.hasTextureType(TextureType.Texture)
  }

  hasNormalTexture(): boolean {
    return this.hasTextureType(TextureType.NormalTexture)
  }

  hasCubeTexture(): boolean {
    return this.hasTextureType(TextureType.CubeTexture)
  }

  hasParticles(): boolean {
    for (let i = 0; i < this.meshes.length; i++) {
      const mesh = this.meshes[i]
      if (mesh instanceof Particles) {
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
  abstract getVertexColorAttribLocation(renderer:Renderer): number
  abstract getVertexTangentAttribLocation(renderer:Renderer): number

  abstract getProjectionMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null
  abstract getModelViewMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null
  abstract getNormalMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null

  abstract getAttributeNames(): string[]
  abstract getUniformNames(): string[]
}