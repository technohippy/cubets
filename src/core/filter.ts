import { Renderer } from "./renderer.js"
import { Scene } from "./scene.js"
import { Material } from "./material.js"
import { PlaneGeometry } from "../geometry/planegeometry.js";
import { Mesh } from "../core/mesh.js";
import { FilteredCamera } from "./camera.js";
import { RGBAColor } from "../math/rgbacolor.js";
import { RenderTarget } from "./rendertarget.js";

export abstract class Filter {
  scene: Scene
  plane: PlaneGeometry
  planeMesh: Mesh

  renderer?: Renderer

  inputRenderTarget?: RenderTarget
  outputRenderTarget?: RenderTarget

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

  setupRenderTarget(parentRenderer:Renderer) {
    this.renderer = parentRenderer.renew()
    this.renderer.prepareRender(this.scene)

    const gl = this.renderer.gl
    const { width, height } = this.renderer.container!

    this.inputRenderTarget = new RenderTarget(width, height)
    this.inputRenderTarget.setup(gl)

    this.outputRenderTarget = new RenderTarget(width, height) // default output (to screen)

    parentRenderer.use()
  }

  resetFrameBuffer() {
    if (!this.renderer) return

    const gl = this.renderer.gl
    this.inputRenderTarget?.reset(gl)
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
      lastFilter.outputRenderTarget = filter.inputRenderTarget
    }
    this.filters.push(filter)
  }

  forEach(fn:(filter:Filter) => void) {
    this.filters.forEach(fn)
  }

  apply(parentRenderer: Renderer, fn:() => void) {
    const gl = parentRenderer.gl

    if (0 < this.filters.length) {
      this.filters[0].inputRenderTarget?.apply(gl)
    }

    fn()
    
    this.filters.forEach(filter => {
      filter.renderer!.use()
      filter.outputRenderTarget!.apply(gl)
      filter.draw()
    })

    parentRenderer.use()
  }
}

export class FilterMaterial extends Material {
  filter?:Filter

  setColor(color: RGBAColor) { }

  prepare(renderer:Renderer, mesh:Mesh) { }
  
  setupGLVars(renderer:Renderer) {
    if (!this.filter) throw "no filter"
    //if (!this.filter.inputTexture)  throw "no inputTexture"

    const gl = renderer.gl
    const samplerLocation = renderer.getUniformLocation("uSampler") // TODO

    this.filter.inputRenderTarget?.setupGLVars(gl, samplerLocation)
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

  getVertexColorAttribLocation(renderer:Renderer): number {
    return -1
  }

  getVertexTangentAttribLocation(renderer:Renderer): number {
    return -1
  }

  // overridable
  getVertexTextureCoordsAttribLocation(renderer:Renderer): number { 
    return renderer.getAttributeLocation("aVertexTextureCoords")
  }

  getProjectionMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null  {
    return renderer.getUniformLocation("nerver called") // TODO
  }

  getModelViewMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null  {
    return renderer.getUniformLocation("nerver called") // TODO
  }

  getNormalMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null  {
    return renderer.getUniformLocation("nerver called") // TODO
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