import { GLAttribute } from "./glattribute.js"
import { GLUniform } from "./gluniform.js"
import { GL2Renderer } from "./gl2renderer.js"
import { GLViewport } from "./glviewport.js"
import { RGBAColor } from "../math/rgbacolor.js"
import { GLProgram } from "./glprogram.js"

export class GLContext {
  target:WebGLFramebuffer | null = null
  viewport = new GLViewport()
  clearColor = new RGBAColor(0, 0, 0)

  attributes:GLAttribute[] = []
  uniforms:GLUniform[] = []

  drawMode:number = WebGLRenderingContext.TRIANGLES
  drawOffset:number = 0
  drawSize?:number

  vao?:WebGLVertexArrayObject

  get assuredDrawSize():number {
    if (this.drawSize) return this.drawSize
    if (this.attributes.length === 0) throw `invalid draw size`
    const firstAttr = this.attributes[0]
    return firstAttr.drawSize()
  }

  add(...params:(GLAttribute | GLUniform)[]) {
    params.forEach(param => {
      if (param instanceof GLAttribute) {
        this.addAttribute(param)
      } else {
        this.addUniform(param)
      }
    })
  }

  addAttribute(attribute:GLAttribute) {
    this.attributes.push(attribute)
  }

  addUniform(uniform:GLUniform) {
    this.uniforms.push(uniform)
  }

  storeLocations(renderer:GL2Renderer, program:GLProgram) {
    this.attributes.forEach(attribute => {
      if (attribute.location < 0) {
        attribute.location = renderer.getAttributeLocation(program, attribute.name)
      }
    })
    this.uniforms.forEach(uniform => {
      if (!uniform.location) {
        uniform.location = renderer.getUniformLocation(program, uniform.name)
      }
    })
  }

  apply(renderer:GL2Renderer) {
    this.uploadVariables(renderer)
    renderer.viewport(this.viewport)
    renderer.clearColor(this.clearColor)
    // TODO: texture
    // TODO: render target
  }
    
  uploadVariables(renderer:GL2Renderer) {
    const attrUpdated = this.attributes.some(a => a.updated)
    if (!this.vao || attrUpdated) { 
      this.vao = renderer.setupVAO(() => {
        this.attributes.forEach(attribute => {
          if (attribute.updated) renderer.uploadAttribute(attribute)
        })
      })
    }
    renderer.bindVertexArray(this.vao)

    this.uniforms.forEach(uniform => {
      if (uniform.updated) renderer.uploadUniform(uniform)
    })
  }
} 