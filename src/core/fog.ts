import { RGBAColor } from "../math/rgbacolor.js";
import { Renderer } from "./renderer.js";

export abstract class Fog {
  color:RGBAColor
  near:number
  far:number

  constructor(color:RGBAColor, near:number, far:number) {
    this.color = color
    this.near = near
    this.far = far
  }

  abstract setupGLVars(renderer:Renderer): void
}