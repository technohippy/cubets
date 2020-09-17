import { GL2Renderer } from "../gl/gl2renderer.js"
import { Scene } from "./scene.js"
import { Camera } from "./camera.js"
import { SceneContext } from "./context/scenecontext.js"

export class Renderer {
  gl: GL2Renderer

  constructor(container:string | HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext) {
    this.gl = new GL2Renderer(container)
  }

  render(scene:Scene, camera?:Camera, context:SceneContext=scene.context) {
    // for first render
    if (!context.prepared) {
     context.setup(scene, camera)
    }
    if (camera && !camera.isSetupContextVars()) {
      camera.setupContextVars(scene.cameraConfig())
    }
    //

    this.gl.clear() // TODO: clear 背景色を設定するため

    if (camera) {
      camera.setup(this)
      camera.setupModelViewMatrix()
      context.writeCamera(camera)
    }

    scene.eachLight((light, i) => {
      context.writeLight(light)
    })
    scene.eachMesh((mesh, i) => {
      // TODO: ここの条件が微妙
      context.context.needClear = scene.meshLength === 1 || i !== scene.meshLength - 1
      context.writeMesh(mesh)
      this.gl.draw(context.program!, context.context)
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