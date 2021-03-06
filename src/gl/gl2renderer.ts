import { GLProgram } from "./glprogram.js"
import { GLContext } from "./glcontext.js"
import { GLBuffer } from "./glbuffer.js"
import { GLAttribute } from "./glattribute.js"
import { GLUniform } from "./gluniform.js"
import { GLViewport } from "./glviewport.js"
import { RGBAColor } from "../math/rgbacolor.js"
import { GLTexture2D } from "./gltexture2d.js"
import { GLFramebuffer } from "./glframebuffer.js"
import { GLIndex } from "./glindex.js"
import { GLTextureCube } from "./gltexturecube.js"
import { GLImage } from "./glimage.js"

export class GL2Renderer {
  debug = false

  container:HTMLCanvasElement | OffscreenCanvas
  #gl:WebGL2RenderingContext

  lastProgram?:GLProgram
  lastFramebuffer:GLFramebuffer | null = null

  maxTextureUnits:number
  maxVertexShaderTextureUnits:number
  maxFragmentShaderTextureUnits:number
  minTextureUnits:number
  #textureUnitUsage:Array<boolean>

  get aspectRatio() {
    if (this.#gl.canvas instanceof HTMLCanvasElement) {
      return this.#gl.canvas.clientWidth / this.#gl.canvas.clientHeight
    } else {
      return this.#gl.canvas.width / this.#gl.canvas.height
    }
  }

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
    }

    this.maxTextureUnits = this.#gl.getParameter(this.#gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
    this.maxVertexShaderTextureUnits = this.#gl.getParameter(this.#gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)
    this.maxFragmentShaderTextureUnits = this.#gl.getParameter(this.#gl.MAX_TEXTURE_IMAGE_UNITS)
    this.minTextureUnits = Math.min(this.maxTextureUnits, this.maxVertexShaderTextureUnits, this.maxFragmentShaderTextureUnits)
    this.#textureUnitUsage = new Array<boolean>(this.minTextureUnits).fill(false)

    this.#gl.pixelStorei(this.#gl.UNPACK_ALIGNMENT, 1)
  }

  draw(program:GLProgram, context:GLContext) {
    if (this.lastProgram !== program || !program.prepared()) {
      if (!program.prepared()) {
        this._debug("prepare program")
        program.prepare(this)
      }
      program.use(this)
      this.lastProgram = program 
    }

    context.storeLocations(this, program)
    context.apply(this)

    if (context.framebuffer !== this.lastFramebuffer) {
      this._debug("setup framebuffer")
      this.deleteFramebuffer(this.lastFramebuffer)
      context.setupFramebuffer(this)
      this.lastFramebuffer = context.framebuffer
    }

    if (context.needClear) {
      this._debug("clear")
      this.clear()
    }

    // draw calls
    if (context.index) {
      context.index.bind(this)
      if (context.instanceing) {
        this.#gl.drawElementsInstanced(context.drawMode, context.assuredDrawSize, context.index.type, 0, context.instanceCount)
      } else {
        this.#gl.drawElements(context.drawMode, context.assuredDrawSize, context.index.type, 0)
      }
    } else {
      if (context.instanceing) {
        this.#gl.drawArraysInstanced(context.drawMode, context.drawOffset, context.assuredDrawSize, context.instanceCount)
      } else {
        this.#gl.drawArrays( context.drawMode, context.drawOffset, context.assuredDrawSize)
      }
    }
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
    if (!buffer) throw "fail to create buffer"
    data.buffer = buffer
    this.bindBuffer(data)
    this.#gl.bufferData(data.target, data.data, data.usage)
  }

  bindBuffer(data:GLBuffer) {
    if (!data.buffer) throw `no buffer:${data}`
    this.#gl.bindBuffer(data.target, data.buffer)
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

  uploadIndex(index:GLIndex) {
    this._debug("upload index")

    index.uploadBufferData(this)
  }

  uploadAttribute(attribute:GLAttribute) {
    this._debug(`upload attribute: ${attribute.name}`)

    attribute.uploadBufferData(this)
    if (attribute.location < 0) throw `no attribute location: ${attribute.name}`
    this.#gl.enableVertexAttribArray(attribute.location)
    this.#gl.vertexAttribPointer(attribute.location, attribute.size, attribute.type, attribute.normalized, attribute.stride, attribute.offset)
    if (0 < attribute.divisor) {
      this.#gl.vertexAttribDivisor(attribute.location, attribute.divisor)
    }
  }

  uploadUniform(uniform:GLUniform) {
    this._debug(`upload uniform: ${uniform.name}`)

    uniform.upload(this)
  }

  uploadTexture(texture:GLTexture2D) {
    this._debug("upload texture", texture, texture.image?.source)

    if (!texture.texture) {
      this._debug("create texture")

      const tex = this.#gl.createTexture()
      if (!tex) throw "fail to create texture"
      texture.texture = tex
    }

    if (texture.textureUnit < 0) {
      texture.textureUnit = this._reserveTextureUnit()
    }

    this.#gl.activeTexture(this.#gl.TEXTURE0 + texture.textureUnit)
    this.#gl.bindTexture(texture.type, texture.texture)
    texture.params.forEach((v, k) => {
      this.#gl.texParameteri(texture.type, k, v)
    })
    const image = texture.image
    if (!image) throw 'texture has no image'
    this.texImage2D(texture.type, image)

    texture.updated = false
  }

  uploadTextureCube(textureCube:GLTextureCube) {
    this._debug("upload textureCube", textureCube)

    if (!textureCube.texture) {
      this._debug("create texture")

      const tex = this.#gl.createTexture()
      if (!tex) throw "fail to create texture"
      textureCube.texture = tex
    }

    if (textureCube.textureUnit < 0) {
      textureCube.textureUnit = this._reserveTextureUnit()
    }

    this.#gl.activeTexture(this.#gl.TEXTURE0 + textureCube.textureUnit)
    this.#gl.bindTexture(textureCube.type, textureCube.texture)
    textureCube.params.forEach((v, k) => {
      this.#gl.texParameteri(textureCube.type, k, v)
    })
    textureCube.images.forEach((image, target) => {
      this.texImage2D(target, image)
      //this.#gl.generateMipmap(this.#gl.TEXTURE_CUBE_MAP)
    })

    textureCube.updated = false
  }

  setupFramebuffer(glfb:GLFramebuffer | null): WebGLFramebuffer | null {
    if (!glfb) {
      this.#gl.bindFramebuffer(this.#gl.FRAMEBUFFER, null)
      return null
    }

    // texture2d
    this.uploadTexture(glfb.texture)

    // renderbuffer
    const {width, height} = glfb.texture.image!
    const renderbuffer = this.#gl.createRenderbuffer()
    if (!renderbuffer) throw "fail to create renderbuffer"
    this.#gl.bindRenderbuffer(this.#gl.RENDERBUFFER, renderbuffer)
    this.#gl.renderbufferStorage(this.#gl.RENDERBUFFER, this.#gl.DEPTH_COMPONENT16, width, height)

    // framebuffer
    const framebuffer = this.#gl.createFramebuffer()
    if (!framebuffer) throw "fail to create framebuffer"
    this.#gl.bindFramebuffer(this.#gl.FRAMEBUFFER, framebuffer)

    if (!glfb.texture.texture) throw "framebuffer has no texture"
    this.#gl.framebufferTexture2D(
      this.#gl.FRAMEBUFFER,
      this.#gl.COLOR_ATTACHMENT0,
      this.#gl.TEXTURE_2D,
      glfb.texture.texture,
      0
    )

    this.#gl.framebufferRenderbuffer(
      this.#gl.FRAMEBUFFER,
      this.#gl.DEPTH_ATTACHMENT,
      this.#gl.RENDERBUFFER,
      renderbuffer,
    )

    return framebuffer
  }

  deleteFramebuffer(glfb:GLFramebuffer | null) {
    if (!glfb) return
    this.#gl.deleteFramebuffer(glfb.framebuffer)
    glfb.framebuffer = null
  }

  // wrap

  useProgram(program:GLProgram) {
    this.#gl.useProgram(program.program!)
  }

  getAttributeLocation(program:GLProgram, name:string):number {
    const loc = this.#gl.getAttribLocation(program.program!, name)
    this._debug(`${name} location: ${loc}`)
    return loc
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

  enable(flag:number) {
    this.#gl.enable(flag)
  }

  enableFlags(flags:number[]) {
    flags.forEach(flag => this.enable(flag))
  }

  clearColor(color:RGBAColor) {
    this.#gl.clearColor(color.r, color.g, color.b, color.a)
  }

  clear(flag:number=WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT) {
    this.#gl.clear(flag)
  }

  texImage2D(target:number, image:GLImage) {
    if (image.source instanceof Uint8Array) {
      this.#gl.texImage2D(
        target,
        image.level,
        image.internalFormat,
        image.width,
        image.height,
        image.border,
        image.format,
        image.type,
        image.source,
        0
      )
    } else {
      this.#gl.texImage2D(
        target,
        image.level,
        image.internalFormat,
        image.width,
        image.height,
        image.border,
        image.format,
        image.type,
        image.source! // null ok
      )
    }
  }

  uniform(type:string, location:WebGLUniformLocation, values:number[]) {
    switch(type) {
      case "1i":
        this.#gl.uniform1i(location, values[0])
        break
      case "2i":
        this.#gl.uniform2i(location, values[0], values[1])
        break
      case "3i":
        this.#gl.uniform3i(location, values[0], values[1], values[2])
        break
      case "4i":
        this.#gl.uniform4i(location, values[0], values[1], values[2], values[3])
        break
      case "1f":
        this.#gl.uniform1f(location, values[0])
        break
      case "2f":
        this.#gl.uniform2f(location, values[0], values[1])
        break
      case "3f":
        this.#gl.uniform3f(location, values[0], values[1], values[2])
        break
      case "4f":
        this.#gl.uniform4f(location, values[0], values[1], values[2], values[3])
        break
      case "1fv":
        this.#gl.uniform1fv(location, values)
        break
      case "2fv":
        this.#gl.uniform2fv(location, values)
        break
      case "3fv":
        this.#gl.uniform3fv(location, values)
        break
      case "4fv":
        this.#gl.uniform4fv(location, values)
        break
      case "m2fv":
        this.#gl.uniformMatrix2fv(location, false, values) // TODO
        break
      case "m3fv":
        this.#gl.uniformMatrix3fv(location, false, values) // TODO
        break
      case "m4fv":
        this.#gl.uniformMatrix4fv(location, false, values) // TODO
        break
      default:
        throw `unsupported type: ${type}`
    }
  }

  // private

  _reserveTextureUnit():number {
    for (let i = 0; i < this.#textureUnitUsage.length; i++) {
      if (this.#textureUnitUsage[i]) continue
      this.#textureUnitUsage[i] = true
      return i
    }
    throw "texture unit overflow"
  }

  _debug(...args: any[]) {
    args.unshift("[")
    args.push("]")
    if (this.debug) console.log(...args)
  }
}