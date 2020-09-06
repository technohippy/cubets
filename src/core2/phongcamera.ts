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
    this.aspectRatio = renderer.gl.aspectRatio
  }
}