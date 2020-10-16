type GLImageParamKey = "level" | "internalFormat" | "width" | "height" | "border" | "format" | "type"
type GLImageParam = {[key in GLImageParamKey]?:number}

export type GLImageSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | Uint8Array

export class GLImage {
  source:GLImageSource | null

  level:number 
  internalFormat:number
  width:number
  height:number
  border:number
  format:number
  type:number

  constructor(source:GLImageSource | null, params:GLImageParam={}) {
    this.source = source
    this.level = params["level"] ?? 0
    this.internalFormat = params["internalFormat"] ?? WebGLRenderingContext.RGBA
    const width = params["width"]
    const height = params["height"]
    if (!source || source instanceof Uint8Array) {
      if (!width) throw `width must be set`
      if (!height) throw `height must be set`
      this.width = width
      this.height = height
    } else if (source instanceof HTMLImageElement) {
      this.width = width ?? source.naturalWidth ?? source.width
      this.height = height ?? source.naturalHeight ?? source.height
    } else if (source instanceof HTMLVideoElement) {
      this.width = width ?? source.videoWidth ?? source.width
      this.height = height ?? source.videoHeight ?? source.height
    } else {
      this.width = width ?? source.width
      this.height = height ?? source.height
    }
    this.border = params["border"] ?? 0
    this.format = params["format"] ?? WebGLRenderingContext.RGBA
    this.type = params["type"] ?? WebGLRenderingContext.UNSIGNED_BYTE
  }
}