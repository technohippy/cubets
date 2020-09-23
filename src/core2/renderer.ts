import { GL2Renderer } from "../gl/gl2renderer.js"
import { Scene } from "./scene.js"
import { Camera } from "./camera.js"
import { SceneContext } from "./context/scenecontext.js"

export class Renderer {
  gl: GL2Renderer
  defaultContext:SceneContext

  constructor(container:string | HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext, flags:number[]=[]) {
    this.gl = new GL2Renderer(container)
    this.defaultContext = new SceneContext(...flags)
  }

  setViewport(width:number, height:number, x:number=0, y:number=0) {
    this.defaultContext.setViewport(width, height, x, y)
  }

  render(scene:Scene, camera?:Camera, context:SceneContext=this.defaultContext) {
    // for first render
    if (camera && !camera.isSetupContextVars()) {
      camera.setupContextVars(scene.cameraConfig())
    }
    if (!context.prepared) {
     context.setupLocations(scene, camera)
    }
    //

    if (camera) {
      camera.setup(this)
      camera.setupModelViewMatrix()
      context.writeCamera(camera)
    }

    scene.eachLight((light, i) => {
      context.writeLight(light, i)
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