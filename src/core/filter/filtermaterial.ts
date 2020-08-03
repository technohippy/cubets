import { Material } from "../material.js"
import { Filter } from "../filter.js"
import { Renderer } from "../renderer.js"
import { RGBAColor } from "../../math/rgbacolor.js"
import { Mesh } from "../mesh.js"

export class FilterMaterial extends Material {
  filter?:Filter
  setupGLVarsFn?:(gl:WebGL2RenderingContext, renderer:Renderer) => void

  constructor(setupGLVarsFn?:((gl:WebGL2RenderingContext, renderer:Renderer) => void)) {
    super()
    this.setupGLVarsFn = setupGLVarsFn
  }

  setColor(color: RGBAColor) { }

  prepare(renderer:Renderer, mesh:Mesh) { }
  
  setupGLVars(renderer:Renderer) {
    if (!this.filter) return
    //if (!this.filter) throw "no filter"
    //if (!this.filter.inputTexture)  throw "no inputTexture"

    const gl = renderer.gl
    const samplerLocation = renderer.getUniformLocation("uSampler") // TODO

    this.filter.inputRenderTarget?.setupGLVars(gl, samplerLocation)

    if (this.setupGLVarsFn) {
      this.setupGLVarsFn(gl, renderer)
    }
  }
}