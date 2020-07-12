import { Camera } from "../core/camera.js"

export abstract class CameraControl {
  camera?:Camera
  container?:HTMLElement

  setCamera(camera: Camera) {
    this.camera = camera
    if (!this.container) {
      this.container = this.camera.renderer.container
    }
  }

  protected _clamp(val:number, min:number, max:number) {
    return Math.max(min, Math.min(max, val))
  }
}