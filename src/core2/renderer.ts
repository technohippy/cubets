import { GL2Renderer } from "../gl/gl2renderer.js"
import { Scene } from "./scene.js"
import { GLContext } from "../gl/glcontext.js"

export class Renderer {
  gl: GL2Renderer
  scenes: Scene[] = []

  constructor(container:string | HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext) {
    this.gl = new GL2Renderer(container)
  }

  addScene(scene:Scene) {
    this.scenes.push(scene)
  }

  render() {
    this.scenes.forEach(scene => {
      if (!scene.program) scene.prepare()
      scene.eachMesh(m => m.writeContext(scene.context))
      this.gl.draw(scene.program!, scene.context)
    })
  }
}