import { Camera } from "./camera.js";
import { Renderer } from "./renderer.js";

export abstract class PhongCamera extends Camera {
  aspectRatio?:number
  near:number
  far:number

  constructor(near:number, far:number) {
    super()
    this.near = near
    this.far = far
  }

  setup(renderer:Renderer) {
    const viewport = renderer.defaultContext.context.viewport
    if (viewport && viewport.width && viewport.height) {
      this.aspectRatio = viewport.width / viewport.height
    } else {
      this.aspectRatio = renderer.gl.aspectRatio
    }
  }
}