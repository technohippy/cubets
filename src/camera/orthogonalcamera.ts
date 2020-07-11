import { Camera } from "../core/camera.js"
import { Renderer } from "../core/renderer.js"

//@ts-ignore
import { glMatrix, mat4 } from "../../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class OrthogonalCamera extends Camera {
  left: number
  right: number
  bottom: number
  top: number
  near: number
  far: number

  constructor(renderer: Renderer | string, width: number, near: number, far: number) {
    super(renderer)
    const height = width / this.renderer.container.width * this.renderer.container.height
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