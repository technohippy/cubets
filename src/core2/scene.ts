import { GLProgram } from "../gl/glprogram.js";
import { GLContext } from "../gl/glcontext.js";
import { Mesh } from "./mesh.js";
import { Light } from "./light.js";
import { GeometryConfig } from "./geometry.js";
import { Material } from "./material.js";
import { Camera } from "./camera.js";
import { ContextWriter } from "./contextwriter.js";
import { GLUniform } from "../gl/gluniform.js";

export abstract class Scene {
  program?:GLProgram
  context:GLContext
  #meshes:Mesh[] = []
  #lights:Light[] = []

  abstract getVertexShader():string
 
  abstract getFragmentShader():string

  abstract geometryConfig():GeometryConfig

  constructor(...flags:number[]) {
    if (flags.length === 0) {
      flags = [
        WebGL2RenderingContext.CULL_FACE,
        WebGL2RenderingContext.DEPTH_TEST,
      ]
    }
    this.context = new GLContext(...flags)
  }

  createMaterial(params?:{[key:string]:any}):Material|null {
    return null
  }

  createLight(params?:{[key:string]:any}):Light|null {
    return null
  }

  createCamera(params?:{[key:string]:any}):Camera|null {
    return null
  }

  materialConfig():{[key:string]:GLUniform} {
    return {}
  }
  
  lightConfig():{[key:string]:GLUniform} {
    return {}
  }

  abstract cameraConfig():{[key:string]:GLUniform}

  protected get meshes():Mesh[] {
    return this.#meshes
  }

  protected get lights():Light[] {
    return this.#lights
  }

  prepare() {
    if (!this.program) {
      this.program = new GLProgram(this.getVertexShader(), this.getFragmentShader())
    }
  }

  addMesh(mesh:Mesh) {
    mesh.setupContextVars(this.geometryConfig(), this.materialConfig())
    this.#meshes.push(mesh)
    if (1 < this.#meshes.length) {
      this.context.needClear = false // TODO: clear
    }
  }

  addLight(light:Light) {
    light.setupContextVars(this.lightConfig())
    this.#lights.push(light)
  }

  add(e:Mesh|Light) {
    if (e instanceof Mesh) {
      this.addMesh(e)
    } else if (e instanceof Light) {
      this.addLight(e)
    }
  }

  each(fn:(w:ContextWriter) => void) {
    this.eachMesh(fn)
    this.eachLight(fn)
  }

  eachMesh(fn:((m:Mesh) => void)) {
    this.#meshes.forEach(fn)
  }

  eachLight(fn:((l:Light) => void)) {
    this.#lights.forEach(fn)
  }
}