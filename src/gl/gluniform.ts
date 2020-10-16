import { GL2Renderer } from "./gl2renderer.js"
import { GLTexture2D } from "./gltexture2d.js"
import { GLTextureCube } from "./gltexturecube.js"
import { GLTexture } from "./gltexture.js"

type GLUniformType = "1i" | "2i" | "3i" | "4i" | "1f" | "2f" | "3f" | "4f" | "1iv" | "2iv" | "3iv" | "4iv" | "1fv" | "2fv" | "3fv" | "4fv" | "m2fv" | "m3fv" | "m4fv"
type GLUniformValueType = number[] | number | boolean | GLTexture2D | GLTextureCube

export class GLUniform {
  name:string
  location?:WebGLUniformLocation | null
  type:string
  #value?:number[] | GLTexture2D | GLTextureCube

  updated = true

  get texture():GLTexture2D | undefined {
    if (this.#value instanceof GLTexture2D) {
      return this.#value
    }
    return undefined
  }

  constructor(name:string, type:GLUniformType, value?:GLUniformValueType) {
    this.name = name
    this.type = type
    if (value) {
      if (value instanceof GLTexture2D || value instanceof GLTextureCube) {
        this.#value = value
      } else {
        this._setNumValue(value)
      }
    }
  }

  updateValue(value:GLUniformValueType, position:number=0) {
    if (value instanceof GLTexture2D) {
      if (this.#value && !(this.#value instanceof GLTexture2D)) {
        throw "current value is not a texture"
      }
      if (position !== 0) {
        throw "position can not be set for texture"
      }
      this.#value = value
    } else if (value instanceof GLTextureCube) {
      if (this.#value && !(this.#value instanceof GLTextureCube)) {
        throw "current value is not a texture"
      }
      if (position !== 0) {
        throw "position can not be set for texture"
      }
      this.#value = value
    } else {
      if (this.#value && (this.#value instanceof GLTexture2D || this.#value instanceof GLTextureCube)) {
        throw "current value is not numbers"
      }
      if (position === 0) {
        this._setNumValue(value)
      } else {
        const index = position * this._positionUnit()
        if (!this.#value) this.#value = []
        if (typeof value === "boolean") {
          (this.#value as number[])[index] = value ? 1 : 0
        } else if (typeof value === "number") {
          (this.#value as number[])[index] = value
        } else {
          for (let i = 0; i < value.length; i++) {
            (this.#value as number[])[index + i] = value[i]
          }
        }

        // fill 0 in empty slot
        for (let i = 0; i < (this.#value as number[]).length; i++) {
          if (!(this.#value as number[])[i]) {
            (this.#value as number[])[i] = 0
          }
        }
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

  private _setNumValue(value:number | number[] | boolean) {
    if (typeof value === "boolean") {
      this.#value = [value ? 1 : 0]
    } else if (typeof value === "number") {
      this.#value = [value]
    } else {
      this.#value = [...value]
    }
  }

  private _positionUnit():number {
    switch (this.type) {
      case "1i":
      case "1f": 
      case "2i":
      case "2f": 
      case "3i":
      case "3f": 
      case "4i": 
      case "4f": 
        console.warn(`cannot set position: ${this.type}`)
        return 0
      case "1iv": 
      case "1fv": 
        return 1
      case "2iv": 
      case "2fv": 
        return 2
      case "3iv": 
      case "3fv": 
        return 3
      case "4iv": 
      case "4fv": 
        return 4
      case "m2fv": 
        return 4
      case "m3fv": 
        return 9
      case "m4fv":
        return 16
    }
    throw `invalid type: ${this.type}`
  }
}