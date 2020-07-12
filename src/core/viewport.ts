import { Vec2 } from "../math/vec2.js";

export class Viewport {
  container: HTMLCanvasElement
  topLeft: Vec2 // 0~1
  size: Vec2 // 0~1

  constructor(container:HTMLCanvasElement | string, topLeft:Vec2=new Vec2(), size:Vec2=new Vec2(1, 1)) {
    if (typeof container === "string") {
      container = document.getElementById(container) as HTMLCanvasElement
    }
    this.container = container
    this.topLeft = topLeft
    this.size = size
  }

  getAspectRatio(): number {
    return (this.container.width * this.size.x) / (this.container.height * this.size.y)
  }

  apply(gl:WebGL2RenderingContext) {
    gl.viewport(
      this.container.width * this.topLeft.x,
      this.container.height * this.topLeft.y,
      this.container.width * this.size.x, 
      this.container.height * this.size.y,
    )
  }
}