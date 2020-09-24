import { Mesh } from "./mesh.js";
import { Light } from "./light.js";
import { GeometryConfig } from "./geometry.js";
import { Material } from "./material.js";
import { Camera } from "./camera.js";
import { GLUniform } from "../gl/gluniform.js";

export abstract class Scene {
  #meshes:Mesh[] = []
  #lights:Light[] = []

  abstract getVertexShader():string
 
  abstract getFragmentShader():string

  abstract geometryConfig():GeometryConfig

  abstract clone():Scene

  get meshLength():number {
    return this.#meshes.length
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

  addMesh(mesh:Mesh) {
    this.#meshes.push(mesh)
  }

  addLight(light:Light) {
    this.#lights.push(light)
  }

  add(e:Mesh|Light) {
    if (e instanceof Mesh) {
      this.addMesh(e)
    } else if (e instanceof Light) {
      this.addLight(e)
    }
  }

  eachMesh(fn:((m:Mesh, i:number) => void)) {
    this.#meshes.forEach(fn)
  }

  eachLight(fn:((l:Light, i:number) => void)) {
    this.#lights.forEach(fn)
  }
}