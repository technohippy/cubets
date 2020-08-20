import { TypedArray, GLBuffer } from "./glbuffer.js";
import { GL2Renderer } from "./gl2renderer.js";

export class GLIndex {
  #buffer?:GLBuffer
  type:number

  updated = true

  set buffer(data:TypedArray | GLBuffer) {
    if (data instanceof GLBuffer) {
      this.#buffer = data
    } else {
      this.#buffer = new GLBuffer(data)
    }
    this.#buffer.target = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER
    
  }

  constructor(type:number=WebGLRenderingContext.UNSIGNED_SHORT) {
    this.type = type
  }

  uploadBufferData(renderer:GL2Renderer) {
    if (!this.#buffer) throw "no buffer data"

    renderer.bufferData(this.#buffer)
    this.updated = false
  }

  bind(renderer:GL2Renderer) {
    if (!this.#buffer) throw "no buffer data"
    renderer.bindBuffer(this.#buffer)
  }

  drawSize():number {
    if (!this.#buffer) throw `no data`
    return this.#buffer.data.length
  }
}