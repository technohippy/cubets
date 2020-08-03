import { Scene } from "./scene.js"
import { PlaneGeometry } from "../geometry/planegeometry.js"
import { Mesh } from "./mesh.js"
import { Renderer } from "./renderer.js"
import { FilterMaterial } from "../core/filter/filtermaterial.js"

export class ShaderScene extends Scene {
  static Material = FilterMaterial
  plane?: PlaneGeometry
  planeMesh?: Mesh

  fragmentShaderBodyFn?:(fragColor:string, frameColor:string)=>string

  constructor(fragmentShaderBodyFn?:string | ((fragColor:string, frameColor:string)=>string)) {
    super()
    if (fragmentShaderBodyFn) this.setShaderBody(fragmentShaderBodyFn)
  }

  setShaderBody(fragmentShaderBodyFn:string | ((fragColor:string, frameColor:string)=>string)) {
    if (typeof fragmentShaderBodyFn === "string") {
      this.fragmentShaderBodyFn = (fragColor:string, frameColor:string)=>fragmentShaderBodyFn
    } else {
      this.fragmentShaderBodyFn = fragmentShaderBodyFn
    }
  }

  setup(material:FilterMaterial=new FilterMaterial()) {
    this.plane = new PlaneGeometry(2, 2)
    this.planeMesh = new Mesh(this.plane, material)
    this.add(this.planeMesh)
  }

  hasTexture(): boolean {
    return false
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

  getVertexOffsetAttribLocation(renderer:Renderer): number {
    return -1
  }
  
  getVertexQuatAttribLocation(renderer:Renderer): number {
    return -1
  }

  getVertexTangentAttribLocation(renderer:Renderer): number {
    return -1
  }

  // overridable
  getVertexTextureCoordsAttribLocation(renderer:Renderer): number { 
    return -1
  }

  getProjectionMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null  {
    return null
  }

  getModelViewMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null  {
    return null
  }

  getNormalMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null  {
    return null
  }

  // overridable
  getAttributeNames(): string[] {
    return [ "aVertexPosition" ]
  }

  // overridable
  getUniformNames(): string[] {
    return []
  }

  getVertexShader(options:{declare?:string, mainBody?:string}={}):string {
    return `#version 300 es
      precision mediump float;

      in vec3 aVertexPosition;

      out vec3 vVertexPosition;
      out vec2 vTextureCoords;

      ${options.declare || ""}

      void main(void) {
        vVertexPosition = aVertexPosition;
        gl_Position = vec4(aVertexPosition, 1.0);

        ${options.mainBody || ""}
      }
    `
  }

  getFragmentShader():string {
    const body = this.getFragmentShaderBody("fragColor", "frameColor")
    if (0 <= body.search(/\s*void\s+main\s*\(/g)) {
      // if main function exists
      if (body.trim().startsWith("#version 300")) {
        // if the shader is complete
        return this.getFragmentShaderBody("fragColor", "frameColor")
      } else {
        // if the shader is incomplete
        return `${this.getFragmentShaderHead()}
          ${this.getFragmentShaderBody("fragColor", "frameColor")}
        `
      }
    } else {
      // if main function does not exist
      return `${this.getFragmentShaderHead()}
        void main(void) {
          ${this.getFragmentShaderBody("fragColor", "frameColor")}
        }
      `
    }
  }

  getFragmentShaderHead(options:{declare?:string}={}):string {
    return `#version 300 es
      precision mediump float;

      in vec3 vVertexPosition;
      out vec4 fragColor;

      ${options.declare || ""}
    `
  }

  getFragmentShaderBody(fragColor:string, frameColor:string):string {
    if (this.fragmentShaderBodyFn) {
      return this.fragmentShaderBodyFn(fragColor, frameColor)
    }
    throw "subclass responsibility"
  }

}