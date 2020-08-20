import { GL2Renderer } from "./gl2renderer"
import { GLContext } from "./glcontext"

export class GLProgram {
  program?:WebGLProgram
  vertexShaderSource:string
  fragmentShaderSource:string

  attributeLocations:Map<string, number> = new Map()
  uniformLocations:Map<string, WebGLUniformLocation> = new Map()

  constructor(vs:string, fs:string) {
    this.vertexShaderSource = vs // TODO: テンプレートにして後から内挿できるようにする
    this.fragmentShaderSource = fs // TODO: テンプレートにして後から内挿できるようにする
  }

  prepared(): boolean {
    return !!this.program
  }

  prepare(renderer:GL2Renderer) {
    this.program = renderer.createProgram(this.vertexShaderSource, this.fragmentShaderSource)
  }

  use(renderer:GL2Renderer) {
    renderer.useProgram(this)
  }
}