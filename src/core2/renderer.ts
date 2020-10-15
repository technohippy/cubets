import { GL2Renderer } from "../gl/gl2renderer.js"
import { Scene } from "./scene.js"
import { Camera } from "./camera.js"
import { SceneContext } from "./context/scenecontext.js"
import { Material } from "./material.js"
import { Texture } from "./texture.js"

export class Renderer {
  gl: GL2Renderer
  defaultContext:SceneContext
  prepared = false

  constructor(container:string | HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext, flags:number[]=[]) {
    this.gl = new GL2Renderer(container)
    this.defaultContext = new SceneContext(...flags)
  }

  setViewport(width:number, height:number, x:number=0, y:number=0) {
    this.defaultContext.setViewport(width, height, x, y)
  }

  prepare(scene:Scene, camera?:Camera, context:SceneContext=this.defaultContext):Promise<void> {
    const textures:Texture[] = []
    scene.eachMesh(mesh => {
      if (mesh.material?.texture) {
        textures.push(mesh.material.texture)
      }
    })
    return Promise.all(textures.map(t => t.loadImage())).then(() => {
      if (camera && !camera.isSetupContextVars()) {
        camera.setupContextVars(scene.cameraConfig())
      }

      if (!context.prepared) {
        context.setupLocations(scene, camera)
      }

      this.prepared = true
    })
  }

  render(scene:Scene, camera?:Camera, context:SceneContext=this.defaultContext) {
    if (!this.prepared) {
      this.prepare(scene, camera, context).then(() => {
        this.render(scene, camera, context)
      })
      return
    }

    if (camera) {
      camera.setup(this)
      camera.setupModelViewMatrix()
      context.writeCamera(camera)
    }

    scene.eachLight((light, i) => {
      context.writeLight(light, i)
    })

    const needClear = context.needClear
    scene.eachMesh((mesh, i) => {
      context.needClear = needClear && i === 0
      context.writeMesh(mesh)
      this.draw(context)
    })
    context.needClear = needClear
  }

  renderLoop(scene:Scene, camera?:Camera) {
    const context = this.defaultContext
    this.prepare(scene, camera, context).then(() => {
      const anim = () => requestAnimationFrame(() => {
        this.render(scene, camera, context)
        anim()
      })
      anim()
    })
  }

  draw(context:SceneContext) {
    this.gl.draw(context.program!, context.context)
  }
}