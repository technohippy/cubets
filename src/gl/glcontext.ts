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

  attributes:GLAttribute[] = [] // TODO: attribute(buffer)を更新したらvaoをリセットしないと駄目
  uniforms:GLUniform[] = []
  textures = []

  vao?:WebGLVertexArrayObject

  add(param:GLAttribute | GLUniform) {
    if (param instanceof GLAttribute) {
      this.addAttribute(param)
    } else {
      this.addUniform(param)
    }
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
    if (!this.vao) { 
      this.vao = renderer.setupVAO(() => {
        this.attributes.forEach(attribute => {
          renderer.uploadAttribute(attribute)
        })
      })
    }
    renderer.bindVertexArray(this.vao)

    this.uniforms.forEach(uniform => {
      renderer.uploadUniform(uniform)
    })
  }
} 