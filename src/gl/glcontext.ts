import { GLAttribute } from "./glattribute.js"
import { GLUniform } from "./gluniform.js"
import { GL2Renderer } from "./gl2renderer.js"
import { GLViewport } from "./glviewport.js"
import { RGBAColor } from "../math/rgbacolor.js"
import { GLProgram } from "./glprogram.js"
import { GLFramebuffer } from "./glframebuffer.js"
import { GLIndex } from "./glindex.js"

export class GLContext {
  framebuffer:GLFramebuffer | null = null

  viewport = new GLViewport()
  clearColor = new RGBAColor(0, 0, 0)

  index?:GLIndex
  attributes:GLAttribute[] = []
  uniforms:GLUniform[] = []

  needClear = true

  // draw call parameters
  drawMode:number = WebGLRenderingContext.TRIANGLES
  drawOffset:number = 0
  drawSize?:number

  vao?:WebGLVertexArrayObject

  get assuredDrawSize():number {
    if (this.drawSize) return this.drawSize
    if (this.index) return this.index.drawSize()
    if (this.attributes.length === 0) throw `invalid draw size`
    const firstAttr = this.attributes[0]
    return firstAttr.drawSize()
  }

  add(...params:(GLAttribute | GLUniform)[]) {
    params.forEach(param => {
      if (param instanceof GLIndex) {
        this.setIndex(param)
      } else if (param instanceof GLAttribute) {
        this.addAttribute(param)
      } else {
        this.addUniform(param)
      }
    })
  }

  setIndex(index:GLIndex) {
    if (this.index) console.warn("index is updated")
    this.index = index
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
  }
    
  uploadVariables(renderer:GL2Renderer) {
    // index
    if (this.index?.updated) {
      renderer.uploadIndex(this.index)
    }

    // attributes
    const attrUpdated = this.attributes.some(a => a.updated)
    if (!this.vao || attrUpdated) { 
      this.vao = renderer.setupVAO(() => {
        this.attributes.forEach(attribute => {
          if (attribute.updated) renderer.uploadAttribute(attribute)
        })
      })
    }
    renderer.bindVertexArray(this.vao)

    // uniforms
    this.uniforms.forEach(uniform => {
      if (uniform.updated) renderer.uploadUniform(uniform)
    })
  }

  setupFramebuffer(renderer:GL2Renderer) {
    if (!this.framebuffer) { // to screen
      renderer.setupFramebuffer(null)
    } else if (!this.framebuffer.prepared()) {
      this.framebuffer.prepare(renderer)
    }
  }

  uniform(name:string):GLUniform | undefined {
    return this.uniforms.find(u => u.name === name)
  }

  attribute(name:string):GLAttribute | undefined {
    return this.attributes.find(a => a.name === name)
  }
} 