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

  constructor(renderer: Renderer | string, x: number, y: number, width: number, near: number, far: number) {
    super(renderer)
    const height = width / this.renderer.container.width * this.renderer.container.height
    this.left = x - width / 2
    this.right = x + width / 2
    this.bottom = y - height / 2
    this.top = y + height / 2
    this.near = near
    this.far = far
  }

  setupProjectionMatrix() {
    mat4.ortho(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far)
  }
}