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

  enableFlags:number[] = []

  needClear = true

  // draw call parameters
  drawMode:number = WebGLRenderingContext.TRIANGLES
  drawOffset:number = 0
  drawSize?:number

  #instancing?:boolean
  #instanceCount?:number

  vao?:WebGLVertexArrayObject

  get assuredDrawSize():number {
    if (this.drawSize) return this.drawSize
    if (this.index) return this.index.drawSize()
    if (this.attributes.length === 0) throw `invalid draw size`
    const firstAttr = this.attributes[0]
    return firstAttr.drawSize()
  }

  get instanceing():boolean {
    if (typeof this.#instancing !== "boolean") {
      this.#instancing = !!(this.attributes.find(a => 0 < a.divisor))
    }
    return this.#instancing!
  }

  set instanceCount(value:number) {
    this.#instanceCount = value
  }

  get instanceCount():number {
    if (typeof this.#instanceCount !== "number") {
      const instAttr = this.attributes.find(a => 0 < a.divisor)
      if (instAttr) {
        this.#instanceCount = instAttr.drawSize()
      } else {
        this.#instanceCount = -1
      }
    }
    return this.#instanceCount
  }

  constructor(...flags:number[]) {
    flags.forEach(flag => this.enable(flag))
  }

  clone():GLContext {
    const context = new GLContext(...this.enableFlags)
    context.framebuffer = this.framebuffer
    context.viewport = this.viewport
    context.clearColor = this.clearColor
    context.index = this.index
    context.attributes = [...this.attributes]
    context.uniforms = [...this.uniforms]
    context.needClear = this.needClear
    context.drawMode = this.drawMode
    context.drawOffset = this.drawOffset
    context.drawSize = this.drawSize
    context.#instancing = this.#instancing
    context.#instanceCount = this.#instanceCount
    context.vao = this.vao
    return context
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

  enable(flag:number) {
    this.enableFlags.push(flag)
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
    this.uploadTextures(renderer)
    this.uploadAttributes(renderer)
    this.uploadUniforms(renderer)
    renderer.enableAll(this.enableFlags)
    this.enableFlags.length = 0 // apply only once
    renderer.viewport(this.viewport)
    renderer.scissor(this.viewport) // TODO: 必要ない場合もあるのでどうするか
    renderer.clearColor(this.clearColor)
  }

  uploadTextures(renderer:GL2Renderer) {
    this.uniforms.forEach(uniform => {
      const texture = uniform.texture
      if (texture?.image?.source instanceof HTMLVideoElement ||
        texture?.image?.source instanceof HTMLCanvasElement) {
        renderer.uploadTexture(texture)
      }
    })
  }

  uploadAttributes(renderer:GL2Renderer) {
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
  }
    
  uploadUniforms(renderer:GL2Renderer) {
    // uniforms
    this.uniforms.forEach(uniform => {
      if (uniform.updated) renderer.uploadUniform(uniform)
    })
  }

  setupFramebuffer(renderer:GL2Renderer) {
    if (!this.framebuffer) { // to screen
      renderer.setupFramebuffer(null)
    } else if (this.framebuffer.updated || !this.framebuffer.prepared()) {
      this.framebuffer.prepare(renderer)
      this.framebuffer.updated = false
    }
  }

  hasUniform(name:string):boolean {
    return !!this.uniform(name)
  }

  hasAttribute(name:string):boolean {
    return !!this.attribute(name)
  }

  uniform(name:string):GLUniform | undefined {
    return this.uniforms.find(u => u.name === name)
  }

  attribute(name:string):GLAttribute | undefined {
    return this.attributes.find(a => a.name === name)
  }
} 