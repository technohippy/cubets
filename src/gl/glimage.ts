export type GLImageSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement

export class GLImage {
  source:GLImageSource

  level:number 
  internalFormat:number
  width:number
  height:number
  border:number
  format:number
  type:number

  constructor(source:GLImageSource, params:Map<string, number>=new Map()) {
    this.source = source
    this.level = params.get("level") || 0
    this.internalFormat = params.get("internalFormat") || WebGLRenderingContext.RGBA
    this.width = params.get("width") || source.width
    this.height = params.get("height") || source.height
    this.border = params.get("border") || 0
    this.format = params.get("format") || WebGLRenderingContext.RGBA
    this.type = params.get("type") || WebGLRenderingContext.UNSIGNED_BYTE
  }
}