import { GL2Renderer } from "../gl/gl2renderer.js"
import { Scene } from "./scene.js"
import { Camera } from "./camera.js"

export class Renderer {
  gl: GL2Renderer

  constructor(container:string | HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext) {
    this.gl = new GL2Renderer(container)
  }

  render(scene:Scene, camera?:Camera) {
    if (!scene.prepared) {
      scene.setup(camera)
    }
    if (camera) {
      if (!camera.isSetupContextVars()) {
        camera.setupContextVars(scene.cameraConfig())
      }
    }

    this.gl.clear() // TODO: clear
    camera?.setup(this)
    camera?.writeContext(scene.context) 
    scene.eachLight((l, i) => {
      l.writeContext(scene.context)
    })
    scene.eachMesh(m => {
      m.writeContext(scene.context)
      this.gl.draw(scene.program!, scene.context)
    })
  }

  renderAnim(scene:Scene, camera?:Camera) {
    const anim = () => requestAnimationFrame(() => {
      this.render(scene, camera)
      anim()
    })
    anim()
  }
}