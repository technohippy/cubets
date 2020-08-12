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

  updateValue(value:number[] | number | GLTexture) {
    if (value instanceof GLTexture) {
      if (!(this.#value instanceof GLTexture)) {
        throw "current value is not a texture"
      }
      this.#value = value
    } else {
      if (this.#value instanceof GLTexture) {
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

    if (this.#value instanceof GLTexture) {
      const texture = this.#value
      if (texture.updated || texture.textureUnit < 0) {
        renderer.uploadTexture(texture)
      }
      renderer.uniform(this.type, this.location, [texture.textureUnit])
    } else {
      renderer.uniform(this.type, this.location, this.#value)
    }
    this.updated = false
  }
}

export class GLUniformI1 {
  constructor(name:string, value:number[] | number | GLTexture) {
    return new GLUniform(name, "1i", value)
  }
}

export class GLUniformF1 {
  constructor(name:string, value:number[] | number) {
    return new GLUniform(name, "1f", value)
  }
}

export class GLUniformF2 {
  constructor(name:string, value:number[] | number) {
    return new GLUniform(name, "2f", value)
  }
}

export class GLUniformFv1 {
  constructor(name:string, value:number[] | number) {
    return new GLUniform(name, "1fv", value)
  }
}