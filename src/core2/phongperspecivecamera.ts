import { GLContext } from "../gl/glcontext.js";
import { PhongCamera } from "./phongcamera.js";

//@ts-ignore
import { glMatrix, mat4 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class PhongPerspectiveCamera extends PhongCamera {
  fov:number

  constructor(fov:number, near:number, far:number) {
    super(near, far)
    if (this.near <= 0) {
      console.warn(`near must be more than zero: ${this.near}`)
      this.near = 0.001
    }
    this.fov = fov
  }

  clone():PhongPerspectiveCamera {
    return new PhongPerspectiveCamera(this.fov, this.near, this.far)
  }

  writeContext(context:GLContext) {
    mat4.perspective(this.projectionMatrix, this.fov, this.aspectRatio, this.near, this.far)

    super.writeContext(context)
  }
}