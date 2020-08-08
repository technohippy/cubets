import { GLImage, GLImageSource } from "./glimage.js";

export class GLTexture {
  static _textureParams = new Map<string, number>([
    ["magFilter", WebGLRenderingContext.TEXTURE_MAG_FILTER],
    ["minFilter", WebGLRenderingContext.TEXTURE_MIN_FILTER],
    ["wrapS", WebGLRenderingContext.TEXTURE_WRAP_S],
    ["wrapT", WebGLRenderingContext.TEXTURE_WRAP_T],
    ["wrapR", WebGL2RenderingContext.TEXTURE_WRAP_R],
    ["baseLevel", WebGL2RenderingContext.TEXTURE_BASE_LEVEL],
    ["compareFunc", WebGL2RenderingContext.TEXTURE_COMPARE_FUNC],
    ["compareMode", WebGL2RenderingContext.TEXTURE_COMPARE_MODE],
    ["maxLevel", WebGL2RenderingContext.TEXTURE_MAX_LEVEL],
    ["maxLod", WebGL2RenderingContext.TEXTURE_MAX_LOD],
    ["minLod", WebGL2RenderingContext.TEXTURE_MIN_LOD],
    //"maxAnisotropyExt"
  ])

  type:number
  image:GLImage | null
  params:Map<number, number>

  constructor(type:number, image:GLImage | GLImageSource | null, params:Map<string, number>=new Map()) {
    this.type = type
    if (!image) {
      this.image = null
    } else if (image instanceof GLImage) {
      this.image = image
    } else {
      this.image = new GLImage(image)
    }
    this.params = new Map()
    params.forEach((v, k) => this._setParam(k, v))
  }

  set magFilter(val:number) { this._setParam("magFilter", val) }
  set minFilter(val:number) { this._setParam("minFilter", val) }
  set wrapS(val:number) { this._setParam("wrapS", val) }
  set wrapT(val:number) { this._setParam("wrapT", val) }
  set wrapR(val:number) { this._setParam("wrapR", val) }
  set baseLevel(val:number) { this._setParam("baseLevel", val) }
  set compareFunc(val:number) { this._setParam("compareFunc", val) }
  set compareMode(val:number) { this._setParam("compareMode", val) }
  set maxLevel(val:number) { this._setParam("maxLevel", val) }
  set maxLod(val:number) { this._setParam("maxLod", val) }
  set minLod(val:number) { this._setParam("minLod", val) }
  
  get magFilter():number { return this._getParam("magFilter") }
  get minFilter():number { return this._getParam("minFilter") }
  get wrapS():number { return this._getParam("wrapS") }
  get wrapT():number { return this._getParam("wrapT") }
  get wrapR():number { return this._getParam("wrapR") }
  get baseLevel():number { return this._getParam("baseLevel") }
  get compareFunc():number { return this._getParam("compareFunc") }
  get compareMode():number { return this._getParam("compareMode") }
  get maxLevel():number { return this._getParam("maxLevel") }
  get maxLod():number { return this._getParam("maxLod") }
  get minLod():number { return this._getParam("minLod") }
  
  _setParam(k:string, v:number) {
    const kn = GLTexture._textureParams.get(k)
    if (!kn) throw `invalid param: ${k}`
    this.params.set(kn, v)
  }
  
  _getParam(k:string):number {
    const kn = GLTexture._textureParams.get(k)
    if (!kn) throw `invalid param: ${k}`
    return this.params.get(kn)!
  }
}