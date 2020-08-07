import { GL2Renderer } from "./gl2renderer.js"
import { GLTexture } from "./gltexture.js"

export class GLUniform {
  name:string
  location?:WebGLUniformLocation | null
  type:string
  #value:number[] | GLTexture

  updated = true

  constructor(name:string, type:string, value:number[] | number | GLTexture) {
    this.name = name
    this.type = type
    if (value instanceof GLTexture) {
      this.#value = value
    } else if (typeof value === "number") {
      this.#value = [value]
    } else {
      this.#value = [...value]
    }
  }

  updateValue(value:number[] | GLTexture) {
    if (value instanceof GLTexture) {
      if (!(this.#value instanceof GLTexture)) {
        throw "current value is not a texture"
      }
      this.#value = value
    } else {
      if (this.#value instanceof GLTexture) {
        throw "current value is not numbers"
      }
      this.#value = [...value]
    }
    this.updated = true
  }

  upload(renderer:GL2Renderer) {
    if (!this.location) throw `no uniform location: ${this.name}`
    if (this.#value instanceof GLTexture) {
      const unit = renderer.uploadTexture(this.#value)
      renderer.uniform(this.type, this.location, [unit])
    } else {
      renderer.uniform(this.type, this.location, this.#value)
    }
    this.updated = false
  }
}