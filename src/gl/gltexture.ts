import { GL2Renderer } from "./gl2renderer"

type GLTextureParamKey = "magFilter" | "minFilter" | "wrapS" | "wrapT" | "wrapR" | "baseLevel" | "compareFunc" | "compareMode" | "maxLevel" | "maxLod" | "minLod"
export type GLTextureParam = {[key in GLTextureParamKey]?:number}

export abstract class GLTexture {
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

  id:string // TODO: use UUID
  texture?:WebGLTexture
  type:number
  params:Map<number, number>

  updated = false
  textureUnit:number = -1

  constructor(type:number, params:GLTextureParam={}) {
    this.id = ("" + Math.ceil(Math.random() * 99999)).padStart(6, "0")
    this.type = type
    this.params = new Map()
    for (const [name, value] of Object.entries(params)) {
      this._setParam(name, value!)
    }
  }

  abstract setupFramebufferTexture(gl:GL2Renderer):void

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