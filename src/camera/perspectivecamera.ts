import { Camera } from "../core/camera.js"
import { Viewport } from "../core/viewport.js"

//@ts-ignore
import { glMatrix, mat4 } from "../../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class PerspectiveCamera extends Camera {
  fov: number
  near: number
  far: number

  constructor(viewport: Viewport | string, fov: number, near: number, far: number) {
    super(viewport)
    this.fov = fov
    this.near = near
    this.far = far
  }

  setupProjectionMatrix() {
    mat4.perspective(this.projectionMatrix, this.fov, this.getAspectRatio(), this.near, this.far)
  }
}