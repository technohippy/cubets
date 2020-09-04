import { GL2Renderer } from "../gl/gl2renderer.js"
import { Scene } from "./scene.js"
import { Camera } from "./camera.js"
import { GLContext } from "../gl/glcontext.js"

export class Renderer {
  gl: GL2Renderer

  constructor(container:string | HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext) {
    this.gl = new GL2Renderer(container)
  }

  render(scene:Scene, camera?:Camera) {
    if (!scene.program) {
      scene.prepare()
    }
    if (camera) {
      if (!camera.isSetupContextVars()) {
        camera.setupContextVars(scene.cameraConfig())
      }
    }

    /*
    const context = new GLContext()
    scene.each(w => w.writeContext(context))
    camera?.setup(this)
    camera?.writeContext(context) 
    scene.each(w => w.writeContext(context))
    this.gl.draw(scene.program!, context)
    */
    scene.each(w => w.writeContext(scene.context))
    camera?.setup(this)
    camera?.writeContext(scene.context) 
    scene.each(w => w.writeContext(scene.context))
    this.gl.draw(scene.program!, scene.context)
    /*
    scene.eachMesh(m => {
      const context = new GLContext()
      camera?.setup(this)
      camera?.writeContext(context) 
      scene.eachLight(l => l.writeContext(context))
      m.writeContext(context)
      this.gl.draw(scene.program!, context)
    })
    */
  }

  renderAnim(scene:Scene, camera?:Camera) {
    const anim = () => requestAnimationFrame(() => {
      this.render(scene, camera)
      anim()
    })
    anim()
  }
}