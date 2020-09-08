import { GLProgram } from "../gl/glprogram.js";
import { GLContext } from "../gl/glcontext.js";
import { Mesh } from "./mesh.js";
import { Light } from "./light.js";
import { GeometryConfig } from "./geometry.js";
import { Material } from "./material.js";
import { Camera } from "./camera.js";
import { ContextWriter } from "./contextwriter.js";
import { GLUniform } from "../gl/gluniform.js";
import { SceneContext } from "./context/scenecontext.js";

export abstract class Scene {
  prepared = false
  program?:GLProgram
  context:GLContext // TODO: 消す
  context2:SceneContext // TODO: -> context
  #meshes:Mesh[] = []
  #lights:Light[] = []

  abstract getVertexShader():string
 
  abstract getFragmentShader():string

  abstract geometryConfig():GeometryConfig

  abstract clone():Scene

  constructor(...flags:number[]) {
    if (flags.length === 0) {
      flags = [
        WebGL2RenderingContext.CULL_FACE,
        WebGL2RenderingContext.DEPTH_TEST,
      ]
    }
    this.context = new GLContext(...flags)
    this.context2 = new SceneContext(...flags)
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

  protected set meshes(ms:Mesh[]) {
    this.#meshes = ms
  }

  protected get lights():Light[] {
    return this.#lights
  }

  protected set lights(ls:Light[]) {
    this.#lights = ls
  }

  setup(camera?:Camera) {
    if (!this.program) {
      this.program = new GLProgram(this.getVertexShader(), this.getFragmentShader())
    }
    this.eachLight(l => {
      this.context2.lights.set(l, l.setupContext(this.lightConfig()))
    })
    this.eachMesh(m => {
      this.context2.geometries.set(m.geometry, m.geometry.setupContext(this.geometryConfig()))
      if (m.material) {
        this.context2.materials.set(m.material, m.material.setupContext(this.materialConfig()))
      }
    })
    if (camera) {
      this.context2.camera = camera.setupContext(this.cameraConfig())
    }
    this.prepared = true
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

  eachMesh(fn:((m:Mesh, i:number) => void)) {
    this.#meshes.forEach(fn)
  }

  eachLight(fn:((l:Light, i:number) => void)) {
    this.#lights.forEach(fn)
  }
}