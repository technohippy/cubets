import { Camera } from "../core/camera.js"

/**
 * CameraControl handles user inputs (e.g. click, touch or device motion)
 * and moves a camera.
 */
export abstract class CameraControl {
  camera?:Camera
  container?:HTMLElement

  setCamera(camera: Camera) {
    this.camera = camera
    if (!this.container) {
      this.container = this.camera.renderer.container
    }
    this.attachEvents()
  }

  abstract attachEvents(): void
  abstract detachEvents(): void

  protected _clamp(val:number, min:number, max:number) {
    return Math.max(min, Math.min(max, val))
  }
}