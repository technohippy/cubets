import { Camera } from "../core/camera.js"
import { Renderer } from "../core/renderer.js"

//@ts-ignore
import { glMatrix, mat4 } from "../../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class PerspectiveCamera extends Camera {
  fov: number
  near: number
  far: number

  constructor(renderer: Renderer | string, fov: number, near: number, far: number) {
    super(renderer)
    this.fov = fov
    this.near = near
    this.far = far
  }

  setupProjectionMatrix() {
    const aspectRatio = this.renderer.container.width / this.renderer.container.height
    mat4.perspective(this.projectionMatrix, this.fov, aspectRatio, this.near, this.far)
  }
}