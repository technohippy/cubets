import { Camera } from "./camera.js";
import { GLContext } from "../gl/glcontext.js";
import { GLUniform } from "../gl/gluniform.js";

//@ts-ignore
import { glMatrix, mat4 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class PhongPerspectiveCamera extends Camera {
  fov:number
  near:number
  far:number

  constructor(params:{[key:string]:any}) {
    super()
    this.fov = params["fov"]
    this.near = params["near"]
    if (this.near <= 0) {
      console.warn(`near must be more than zero: ${this.near}`)
      this.near = 0.001
    }
    this.far = params["far"]
  }

  writeContext(context:GLContext) {
    const aspectRatio = 1
    mat4.perspective(this.projectionMatrix, this.fov, aspectRatio, this.near, this.far)

    super.writeContext(context)
  }
}