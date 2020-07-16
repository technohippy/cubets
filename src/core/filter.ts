import { Renderer } from "./renderer.js"
import { Scene } from "./scene.js"
import { Material } from "./material.js"
import { PlaneGeometry } from "../geometry/planegeometry.js";
import { Mesh } from "../core/mesh.js";
import { RGBAColor } from "../math/rgbacolor.js";
import { Quat } from "../math/quat.js";

export abstract class Filter {
  prev?: Filter
  next?: Filter

  scene: Scene
  plane: PlaneGeometry
  planeMesh: Mesh

  renderer?: Renderer

  inputTexture?:WebGLTexture 
  inputRenderbuffer?:WebGLRenderbuffer
  inputFrameBuffer:WebGLFramebuffer | null = null
  outputFrameBuffer:WebGLFramebuffer | null = null

  constructor() {
    this.scene = new FilterScene()
    this.scene.clearColor = RGBAColor.Blue
    this.plane = new PlaneGeometry(2, 2)
    this.planeMesh = new Mesh(
      this.plane,
      new FilterScene.Material(this),
    )
    this.scene.add(this.planeMesh)
  }

  setupFrameBuffer(parentRenderer:Renderer) {
    this.renderer = parentRenderer.renew()
    this.renderer.prepareProgram(this.scene)

    this.renderer.use()

    this.renderer.setupLocations(this.scene)

    const gl = this.renderer.gl
    const { width, height } = this.renderer.container

    this.inputTexture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, this.inputTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

    this.inputRenderbuffer = gl.createRenderbuffer()!
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.inputRenderbuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height)

    this.inputFrameBuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.inputFrameBuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.inputTexture, 0)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.inputRenderbuffer)

    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    parentRenderer.use()
  }

  resetFrameBuffer() {
    if (!this.renderer) return
    const gl = this.renderer.gl
    const { width, height } = this.renderer.container

    gl.bindTexture(gl.TEXTURE_2D, this.inputTexture!);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.bindRenderbuffer(gl.RENDERBUFFER, this.inputRenderbuffer!);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  }

  get first(): Filter | undefined {
    let first: Filter = this
    while (first.prev) {
      first = first.prev
    }
    return first
  }

  get last(): Filter {
    let last: Filter = this
    while (last.next) {
      last = last.next
    }
    return last
  }

  forEach(fn:(filter:Filter) => void) {
    fn(this)
    this.next?.forEach(fn)
  }

  join(filter: Filter) {
    let lastFilter = this.last
    lastFilter.next = filter
    filter.prev = lastFilter
    lastFilter.outputFrameBuffer = filter.inputFrameBuffer
  }

  abstract draw(): void
}

export class FilterChain extends Filter {
  get first(): Filter | undefined {
    return this.next
  }

  exist(): boolean {
    return this.next !== undefined
  }

  apply(parentRenderer: Renderer, fn:() => void) {
    const gl = parentRenderer.gl

    let cur = this.next
    if (cur) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, cur.inputFrameBuffer)
    }

    fn()
    
    while (cur) {
      cur.renderer!.use()
      gl.bindFramebuffer(gl.FRAMEBUFFER, cur.outputFrameBuffer)
      cur.draw()
      cur = cur.next
    }

    parentRenderer.use()
  }

  draw() {
    // TODO: 本当はFilterChainはFilterを継承しなくていい
  }
}

class FilterMaterial extends Material {
  filter:Filter

  constructor(filter:Filter) {
    super()
    this.filter = filter
  }

  setupGLVars(renderer:Renderer) {
    if (!this.filter.inputTexture)  throw "no inputTexture"

    const gl = renderer.gl
    const samplerLocation = renderer.getUniformLocation("uSampler")

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.filter.inputTexture)
    gl.uniform1i(samplerLocation, 0)
  }
}

export class FilterScene extends Scene {
  static Material = FilterMaterial

  constructor(name="filter scene") {
    super(name)
  }

  hasTexture(): boolean {
    return true
  }

  getVertexPositionAttribLocation(renderer:Renderer): number {
    return renderer.getAttributeLocation("aVertexPosition")
  }

  getVertexNormalAttribLocation(renderer:Renderer): number {
    return -1
  }

  getVertexTextureCoordsAttribLocation(renderer:Renderer): number { 
    return renderer.getAttributeLocation("aVertexTextureCoords")
  }

  getProjectionMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation {
    // TODO
    return renderer.getUniformLocation("nerver called")
  }

  getModelViewMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation {
    // TODO
    return renderer.getUniformLocation("nerver called")
  }

  getNormalMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation {
    // TODO
    return renderer.getUniformLocation("nerver called")
  }

  getAttributeNames(): string[] {
    return [ "aVertexPosition", "aVertexTextureCoords" ]
  }

  getUniformNames(): string[] {
    return [ "uSampler" ]
  }

  getVertexShader():string {
    return `#version 300 es
      precision mediump float;

      in vec3 aVertexPosition;
      in vec2 aVertexTextureCoords;

      out vec2 vTextureCoords;

      void main(void) {
        vTextureCoords = aVertexTextureCoords;
        gl_Position = vec4(aVertexPosition, 1.0);
      }
    `
  }

  getFragmentShader():string {
    return `#version 300 es
      precision mediump float;

      uniform sampler2D uSampler;

      in vec2 vTextureCoords;

      out vec4 fragColor;

      void main(void) {
        vec4 frameColor = texture(uSampler, vTextureCoords);
        float luminance = frameColor.r * 0.3 + frameColor.g * 0.59 + frameColor.b * 0.11;
        fragColor = vec4(luminance, luminance, luminance, frameColor.a);

        // for test
        //fragColor = vec4(1.0, 0.0, 0.0, 1.0);
        //fragColor = frameColor;
      }
   `
  }
}