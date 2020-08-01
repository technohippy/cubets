import { Camera } from "../core/camera.js"
import { Viewport } from "../core/viewport.js"

//@ts-ignore
import { glMatrix, mat4 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

/**
 * Represents a perspective camera
 */
export class PerspectiveCamera extends Camera {
  /** @internal */
  fov: number

  /** @internal */
  near: number

  /** @internal */
  far: number

  /**
   * Constructs a perspective camera
   * @param viewport the area where a scene is rendered in
   * @param fov the angle of the field of view
   * @param near the distance to near plane
   * @param far the distance to far plane
   */
  constructor(viewport: Viewport | string, fov: number, near: number, far: number) {
    super(viewport)
    this.fov = fov
    if (near <= 0) {
      console.warn(`near must be more than zero: ${near}`)
      near = 0.001
    }
    this.near = near
    this.far = far
  }

  /** @internal */
  setupProjectionMatrix() {
    mat4.perspective(this.projectionMatrix, this.fov, this.getAspectRatio(), this.near, this.far)
  }
}