import { Camera } from "../core/camera.js"
import { Viewport } from "../core/viewport.js"

//@ts-ignore
import { glMatrix, mat4 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

/**
 * Represents an orthogonal camera
 */
export class OrthogonalCamera extends Camera {
  /** @internal */
  left: number

  /** @internal */
  right: number

  /** @internal */
  bottom: number

  /** @internal */
  top: number

  /** @internal */
  near: number

  /** @internal */
  far: number

  /**
   * Constructs an orthogonal camera
   * @param viewport the area where a scene is rendered in
   * @param width the width of the viewbox (height is derived from the width and the aspect ratio of the viewport)
   * @param near the distance to near plane
   * @param far the distance to far plane
   */
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

  /** @internal */
  setupProjectionMatrix() {
    mat4.ortho(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far)
  }
}