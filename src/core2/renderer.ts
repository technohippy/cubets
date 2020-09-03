import { GL2Renderer } from "../gl/gl2renderer.js"
import { Scene } from "./scene.js"
import { Camera } from "./camera.js"

export class Renderer {
  gl: GL2Renderer

  constructor(container:string | HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext) {
    this.gl = new GL2Renderer(container)
  }

  render(scene:Scene, camera?:Camera) {
    if (!scene.program) scene.prepare()
    scene.each(w => w.writeContext(scene.context))
    camera?.writeContext(scene.context) 
    this.gl.draw(scene.program!, scene.context)
  }
}