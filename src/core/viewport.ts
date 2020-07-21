import { Vec2 } from "../math/vec2.js";

export class Viewport {
  container?: HTMLCanvasElement
  topLeft: Vec2 // if container exists, topLeft is its ratio (0~1), otherwise actual value
  size: Vec2  // if container exists, topLeft is its ratio (0~1), otherwise actual value

  constructor(topLeft:Vec2=new Vec2(), size:Vec2=new Vec2(1, 1), container?: HTMLCanvasElement | string) {
    if (typeof container === "string") {
      container = document.getElementById(container) as HTMLCanvasElement
    }
    this.container = container
    this.topLeft = topLeft
    this.size = size
  }

  getAspectRatio(): number {
    if (this.container) {
      return (this.container.width * this.size.x) / (this.container.height * this.size.y)
    } else {
      return this.size.x / this.size.y
    }
  }

  apply(gl:WebGL2RenderingContext) {
    if (this.container) {
      gl.viewport(
        this.container.width * this.topLeft.x,
        this.container.height * this.topLeft.y,
        this.container.width * this.size.x, 
        this.container.height * this.size.y,
      )
    } else {
      gl.viewport(
        this.topLeft.x,
        this.topLeft.y,
        this.size.x, 
        this.size.y,
      )
    }
  }
}