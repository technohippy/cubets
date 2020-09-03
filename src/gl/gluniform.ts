import { GL2Renderer } from "./gl2renderer.js"
import { GLTexture2D } from "./gltexture2d.js"
import { GLTextureCube } from "./gltexturecube.js"

type GLUniformType = "1i" | "2i" | "3i" | "4i" | "1f" | "2f" | "3f" | "4f" | "1iv" | "1fv" | "2fv" | "3fv" | "4fv" | "m2fv" | "m3fv" | "m4fv"

export class GLUniform {
  name:string
  location?:WebGLUniformLocation | null
  type:string
  #value?:number[] | GLTexture2D | GLTextureCube

  updated = true

  constructor(name:string, type:GLUniformType, value?:number[] | number | GLTexture2D | GLTextureCube) {
    this.name = name
    this.type = type
    if (value) {
      if (value instanceof GLTexture2D || value instanceof GLTextureCube) {
        this.#value = value
      } else if (typeof value === "number") {
        this.#value = [value]
      } else {
        this.#value = [...value]
      }
    }
  }

  updateValue(value:number[] | number | GLTexture2D) {
    if (value instanceof GLTexture2D) {
      if (this.#value && !(this.#value instanceof GLTexture2D)) {
        throw "current value is not a texture"
      }
      this.#value = value
    } else {
      if (this.#value && this.#value instanceof GLTexture2D) {
        throw "current value is not numbers"
      }
      if (typeof value === "number") {
        this.#value = [value]
      } else {
        this.#value = [...value]
      }
    }
    this.updated = true
  }

  upload(renderer:GL2Renderer) {
    if (!this.location) throw `no uniform location: ${this.name}`
    if (!this.#value) throw `no uniform value: ${this.name}`

    if (this.#value instanceof GLTexture2D) {
      const texture = this.#value
      if (texture.updated || texture.textureUnit < 0) {
        renderer.uploadTexture(texture)
      }
      renderer.uniform(this.type, this.location, [texture.textureUnit])
    } else if (this.#value instanceof GLTextureCube) {
      const textureCube = this.#value
      if (textureCube.updated || textureCube.textureUnit < 0) {
        renderer.uploadTextureCube(textureCube)
      }
    } else {
      renderer.uniform(this.type, this.location, this.#value)
    }
    this.updated = false
  }
}