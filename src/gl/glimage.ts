export type GLImageSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement

export class GLImage {
  source:GLImageSource | null

  level:number 
  internalFormat:number
  width:number
  height:number
  border:number
  format:number
  type:number

  constructor(source:GLImageSource | null, params:Map<string, number>=new Map()) {
    this.source = source
    this.level = params.get("level") || 0
    this.internalFormat = params.get("internalFormat") || WebGLRenderingContext.RGBA
    const width = params.get("width")
    const height = params.get("height")
    if (!source) {
      if (!width) throw `width must be set`
      if (!height) throw `height must be set`
      this.width = width
      this.height = height
    } else {
      this.width = width || source.width
      this.height = height || source.height
    }
    this.border = params.get("border") || 0
    this.format = params.get("format") || WebGLRenderingContext.RGBA
    this.type = params.get("type") || WebGLRenderingContext.UNSIGNED_BYTE
  }
}