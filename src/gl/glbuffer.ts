export type TypedArray = Uint16Array | Uint32Array | Int16Array | Int32Array | Float32Array | Float64Array

export class GLBuffer {
  data:TypedArray
  target:number
  usage:number

  static f32(data:number[], target:number=WebGL2RenderingContext.ARRAY_BUFFER, usage:number=WebGL2RenderingContext.STATIC_DRAW):GLBuffer {
    return new GLBuffer(new Float32Array(data), target, usage)
  }

  constructor(data:TypedArray, target:number=WebGL2RenderingContext.ARRAY_BUFFER, usage:number=WebGL2RenderingContext.STATIC_DRAW) {
    this.data = data
    this.target = target
    this.usage = usage
  }
}