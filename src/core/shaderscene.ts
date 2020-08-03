import { Scene } from "./scene.js"
import { PlaneGeometry } from "../geometry/planegeometry.js"
import { Mesh } from "./mesh.js"
import { Renderer } from "./renderer.js"
import { FilterMaterial } from "../core/filter.js"

export class ShaderScene extends Scene {
  static Material = FilterMaterial
  plane?: PlaneGeometry
  planeMesh?: Mesh

  fragmentShaderBodyFn?:(fragColor:string, frameColor:string)=>string

  constructor(fragmentShaderBodyFn?:string | ((fragColor:string, frameColor:string)=>string)) {
    super()
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
    return renderer.getAttributeLocation("aVertexTextureCoords")
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

      out vec3 vVertexPosition;
      out vec2 vTextureCoords;

      void main(void) {
        vVertexPosition = aVertexPosition;
        vTextureCoords = aVertexTextureCoords;
        gl_Position = vec4(aVertexPosition, 1.0);
      }
    `
  }

  getFragmentShader():string {
    const body = this.getFragmentShaderBody("fragColor", "frameColor")
    if (0 <= body.search(/\s*void\s+main\s*\(/g)) {
      // if main function exists
      if (body.trim().startsWith("#version 300")) {
        console.log(this.getFragmentShaderBody("fragColor", "frameColor"))
        // if the shader is complete
        return this.getFragmentShaderBody("fragColor", "frameColor")
      } else {
        console.log(`${this.getFragmentShaderHead()}
          ${this.getFragmentShaderBody("fragColor", "frameColor")}
        ` )
        // if the shader is incomplete
        return `${this.getFragmentShaderHead()}
          ${this.getFragmentShaderBody("fragColor", "frameColor")}
        `
      }
    } else {
      // if main function does not exist
      return `${this.getFragmentShaderHead()}
        void main(void) {
          vec4 frameColor = texture(uSampler, vTextureCoords);
          ${this.getFragmentShaderBody("fragColor", "frameColor")}
        }
      `
    }
  }

  getFragmentShaderHead():string {
    return `#version 300 es
      precision mediump float;

      uniform sampler2D uSampler;
      in vec3 vVertexPosition;
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