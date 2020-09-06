import { PhongCamera } from "./phongcamera.js";
import { GLContext } from "../gl/glcontext.js";

//@ts-ignore
import { glMatrix, mat4 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class PhongOrthogonalCamera extends PhongCamera {
  width:number

  constructor(width:number, near:number, far:number) {
    super(near, far)
    this.width = width
  }

  writeContext(context:GLContext) {
    mat4.ortho(this.projectionMatrix, this.width, this.aspectRatio! * this.width, this.near, this.far)

    super.writeContext(context)
  }
}