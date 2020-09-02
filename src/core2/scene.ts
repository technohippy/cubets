import { GLProgram } from "../gl/glprogram.js";
import { GLContext } from "../gl/glcontext.js";
import { Mesh } from "./mesh.js";
import { Light } from "./light.js";
import { GeometryConfig } from "./geometry.js";

export abstract class Scene {
  program?:GLProgram
  context = new GLContext()
  #meshes:Mesh[] = []
  lights:Light[] = []

  abstract getVertexShader():string
 
  abstract getFragmentShader():string

  abstract geometryConfig():GeometryConfig

  prepare() {
    if (!this.program) {
      this.program = new GLProgram(this.getVertexShader(), this.getFragmentShader())
    }
  }

  eachMesh(fn:((m:Mesh) => void)) {
    this.#meshes.forEach(fn)
  }

  addMesh(mesh:Mesh) {
    mesh.geometry.setConfig(this.geometryConfig())
    this.#meshes.push(mesh)
  }
}