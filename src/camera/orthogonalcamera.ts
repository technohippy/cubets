import { Camera } from "../core/camera.js"
import { Viewport } from "../core/viewport.js"

//@ts-ignore
import { glMatrix, mat4 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class OrthogonalCamera extends Camera {
  left: number
  right: number
  bottom: number
  top: number
  near: number
  far: number

  constructor(viewport:Viewport | string, width: number, near: number, far: number) {
    super(viewport)
    const height = width / this.getAspectRatio()
    this.left = -width / 2
    this.right = +width / 2
    this.bottom = -height / 2
    this.top = +height / 2
    this.near = near
    this.far = far
  }

  setupProjectionMatrix() {
    mat4.ortho(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far)
  }
}