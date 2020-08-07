import { TypedArray, GLBuffer } from "./glbuffer.js"
import { GL2Renderer } from "./gl2renderer.js"

export class GLAttribute {
  name:string
  size:number
  type:number
  normalized:boolean
  stride:number
  offset:number
  #buffer?:GLBuffer

  location:number = -1

  set buffer(data:TypedArray | GLBuffer) {
    if (data instanceof GLBuffer) {
      this.#buffer = data
    } else {
      this.#buffer = new GLBuffer(data)
    }
  }

  constructor(name:string, size:number, type:number, normalized:boolean=false, stride:number=0, offset:number=0, buffer?:TypedArray | GLBuffer) {
    this.name = name
    this.size = size
    this.type = type
    this.normalized = normalized
    this.stride = stride
    this.offset = offset
    if (buffer) this.buffer = buffer
  }

  uploadBufferData(renderer:GL2Renderer) {
    if (!this.#buffer) {
      throw "no buffer data"
    }
    renderer.bufferData(this.#buffer)
  }
}