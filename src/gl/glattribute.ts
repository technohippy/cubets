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

  divisor?:number

  location:number = -1

  updated = true

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

  updateBufferData(dataOrFn:number[] | ((data:number[]) => number[])) {
    if (!this.#buffer) throw 'no data'

    let fn:(data:number[]) => number[]
    if (Array.isArray(dataOrFn)) {
      fn = () => dataOrFn
    } else {
      fn = dataOrFn
    }
    this.#buffer.update(fn)
    this.updated = true
  }

  uploadBufferData(renderer:GL2Renderer) {
    if (!this.#buffer) {
      throw "no buffer data"
    }
    renderer.bufferData(this.#buffer)
    this.updated = false
  }

  drawSize():number {
    if (!this.#buffer) throw `no data`
    return (this.#buffer.data.length - this.offset) / (this.stride === 0 ? 1 : this.stride) / this.size
  }
}