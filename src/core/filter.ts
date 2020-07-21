import { Renderer } from "./renderer.js"
import { Scene } from "./scene.js"
import { Material } from "./material.js"
import { PlaneGeometry } from "../geometry/planegeometry.js";
import { Mesh } from "../core/mesh.js";
import { FilteredCamera } from "./camera.js";

export abstract class Filter {
  scene: Scene
  plane: PlaneGeometry
  planeMesh: Mesh

  renderer?: Renderer

  inputTexture?:WebGLTexture 
  inputRenderbuffer?:WebGLRenderbuffer
  inputFrameBuffer:WebGLFramebuffer | null = null
  outputFrameBuffer:WebGLFramebuffer | null = null

  constructor(scene:FilterScene | string, material:FilterMaterial = new FilterMaterial()) {
    material.filter = this
    if (typeof scene === "string") {
      const body = scene as string
      scene = new FilterScene((frag:string, frame:string)=>body)
    }
    this.scene = scene
    this.plane = new PlaneGeometry(2, 2)
    this.planeMesh = new Mesh(this.plane, material)
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

  draw() {
    this.renderer!.render(this.scene, new FilterCamera())
  }
}

// do almost nothing
class FilterCamera implements FilteredCamera {
  resetFilters() {
    // do nothing
  }

  applyFilters(renderer:Renderer, fn:()=>void) {
    fn()
  }
  
  setupGLMatrixes(renderer:Renderer, scene:Scene) {
    // do nothing
  }
}

export class FilterChain {
  filters: Filter[] = []

  push(filter:Filter) {
    if (0 < this.filters.length) {
      const lastFilter = this.filters[this.filters.length-1]
      lastFilter.outputFrameBuffer = filter.inputFrameBuffer
    }
    this.filters.push(filter)
  }

  forEach(fn:(filter:Filter) => void) {
    this.filters.forEach(fn)
  }

  apply(parentRenderer: Renderer, fn:() => void) {
    const gl = parentRenderer.gl

    if (0 < this.filters.length) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.filters[0].inputFrameBuffer)
    }

    fn()
    
    this.filters.forEach(filter => {
      filter.renderer!.use()
      gl.bindFramebuffer(gl.FRAMEBUFFER, filter.outputFrameBuffer)
      filter.draw()
    })

    parentRenderer.use()
  }
}

export class FilterMaterial extends Material {
  filter?:Filter

  setupGLVars(renderer:Renderer) {
    if (!this.filter) throw "no filter"
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

  fragmentShaderBodyFn?:(fragColor:string, frameColor:string)=>string

  constructor(fragmentShaderBodyFn?:(fragColor:string, frameColor:string)=>string) {
    super()
    this.fragmentShaderBodyFn = fragmentShaderBodyFn
  }

  hasTexture(): boolean {
    return true
  }

  // overridable
  getVertexPositionAttribLocation(renderer:Renderer): number {
    return renderer.getAttributeLocation("aVertexPosition")
  }

  getVertexNormalAttribLocation(renderer:Renderer): number {
    return -1
  }

  // overridable
  getVertexTextureCoordsAttribLocation(renderer:Renderer): number { 
    return renderer.getAttributeLocation("aVertexTextureCoords")
  }

  getProjectionMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null  {
    // TODO
    return renderer.getUniformLocation("nerver called")
  }

  getModelViewMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null  {
    // TODO
    return renderer.getUniformLocation("nerver called")
  }

  getCameraMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null {
    // TODO
    return renderer.getUniformLocation("nerver called")
  }

  getNormalMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null  {
    // TODO
    return renderer.getUniformLocation("nerver called")
  }

  // overridable
  getAttributeNames(): string[] {
    return [ "aVertexPosition", "aVertexTextureCoords" ]
  }

  // overridable
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
    const body = this.getFragmentShaderBody("fragColor", "frameColor")
    return `${this.getFragmentShaderHead()}

      void main(void) {
        vec4 frameColor = texture(uSampler, vTextureCoords);
        ${this.getFragmentShaderBody("fragColor", "frameColor")}
      }
   `
  }

  getFragmentShaderHead():string {
    return `#version 300 es
      precision mediump float;

      uniform sampler2D uSampler;
      in vec2 vTextureCoords;
      out vec4 fragColor;
    `
  }

  getFragmentShaderBody(fragColor:string, frameColor:string):string {
    if (this.fragmentShaderBodyFn) {
      return this.fragmentShaderBodyFn(fragColor, frameColor)
    }
    throw "subclass responsibility"
  }
}