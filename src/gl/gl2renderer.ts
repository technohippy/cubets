import { GLProgram } from "./glprogram"
import { GLContext } from "./glcontext"
import { GLBuffer } from "./glbuffer"
import { GLAttribute } from "./glattribute"
import { GLUniform } from "./gluniform"
import { GLViewport } from "./glviewport"
import { RGBAColor } from "../math/rgbacolor"

export class GL2Renderer {
  container:HTMLCanvasElement | OffscreenCanvas
  #gl:WebGL2RenderingContext

  lastProgram?:GLProgram

  constructor(container:string | HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext) {
    if (container instanceof WebGL2RenderingContext) {
      this.container = container.canvas
      this.#gl = container
    } else {
      if (container instanceof HTMLCanvasElement || container instanceof OffscreenCanvas) {
        this.container = container
      } else { // typeof container === "string"
        const canvas = document.querySelector(container)
        if (!(canvas instanceof HTMLCanvasElement || canvas instanceof OffscreenCanvas)) {
          throw `invalid container: ${canvas}`
        }
        this.container = canvas
      }
      const gl = this.container.getContext("webgl2")
      if (!gl) {
        throw "fail to get webgl2 context"
      }
      this.#gl = gl
      this.#gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
    }
  }

  draw(program:GLProgram, context:GLContext) {
    if (this.lastProgram !== program || !program.prepared()) {
      if (!program.prepared()) {
        program.prepare(this)
      }
      program.use(this)
      this.lastProgram = program 
    }

    context.storeLocations(this, program)
    context.apply(this)
    this.clear()
    this.#gl.drawArrays(this.#gl.TRIANGLES, 0, 3)
  }

  createProgram(vertexShaderSource:string, fragmentShaderSource:string):WebGLProgram {
    const vertexShader = this._createShader(this.#gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = this._createShader(this.#gl.FRAGMENT_SHADER, fragmentShaderSource)

    const program = this.#gl.createProgram()
    if (!program) {
      throw "fail to create program"
    }
    this.#gl.attachShader(program, vertexShader)
    this.#gl.attachShader(program, fragmentShader)
    this.#gl.linkProgram(program)
    if (!this.#gl.getProgramParameter(program, this.#gl.LINK_STATUS)) {
      console.warn(this.#gl.getProgramInfoLog(program));
      this.#gl.deleteProgram(program);
      throw "fail to link program"
    }

    return program!
  }

  _createShader(type:number, shaderSource:string):WebGLShader {
    const shader = this.#gl.createShader(type)
    if (!shader) {
      throw `fail to create shader: ${type}`
    }
    this.#gl.shaderSource(shader, shaderSource)
    this.#gl.compileShader(shader)
    if (!this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS)) {
      console.warn(this.#gl.getShaderInfoLog(shader))
      this.#gl.deleteShader(shader)
      throw `fail to compile shader: ${shaderSource}`
    }
    return shader
  }

  bufferData(data:GLBuffer) {
    const buffer = this.#gl.createBuffer()
    this.#gl.bindBuffer(data.target, buffer)
    this.#gl.bufferData(data.target, data.data, data.usage)
  }

  setupVAO(fn:()=>void):WebGLVertexArrayObject {
    const vao = this.#gl.createVertexArray()
    if (!vao)  throw "fail to create VAO"

    this.#gl.bindVertexArray(vao)
    fn()
    this.#gl.bindVertexArray(null)
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, null)

    return vao
  }

  uploadAttribute(attribute:GLAttribute) {
    attribute.uploadBufferData(this)
    if (attribute.location < 0) throw `no attribute location: ${attribute.name}`
    this.#gl.enableVertexAttribArray(attribute.location)
    this.#gl.vertexAttribPointer(attribute.location, attribute.size, attribute.type, attribute.normalized, attribute.stride, attribute.offset)
  }

  uploadUniform(uniform:GLUniform) {
    if (!uniform.location) throw `no uniform location: ${uniform.name}`
    switch(uniform.type) {
      case "3f":
        this.#gl.uniform3f(uniform.location, uniform.values[0], uniform.values[1], uniform.values[2])
        break
    }
  }

  // wrap

  useProgram(program:GLProgram) {
    this.#gl.useProgram(program.program!)
  }

  getAttributeLocation(program:GLProgram, name:string):number {
    return this.#gl.getAttribLocation(program.program!, name)
  }

  getUniformLocation(program:GLProgram, name:string):WebGLUniformLocation | null {
    return this.#gl.getUniformLocation(program.program!, name)
  }

  bindVertexArray(vao:WebGLVertexArrayObject | null) {
    this.#gl.bindVertexArray(vao)
  }

  viewport(viewport:GLViewport) {
    this.#gl.viewport(
      viewport.x, 
      viewport.y, 
      viewport.width || this.#gl.canvas.width,
      viewport.height || this.#gl.canvas.height,
    )
  }

  clearColor(color:RGBAColor) {
    this.#gl.clearColor(color.r, color.g, color.b, color.a)
  }

  clear(flag:number=WebGL2RenderingContext.COLOR_BUFFER_BIT) {
    this.#gl.clear(flag)
  }
}