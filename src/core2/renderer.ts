import { GL2Renderer } from "../gl/gl2renderer.js"
import { Scene } from "./scene.js"
import { Camera } from "./camera.js"
import { SceneContext } from "./context/scenecontext.js"
import { Texture } from "./texture.js"
import { CubeTexture } from "./cubetexture.js"
import { ReflectionTexture } from "./reflectiontexture.js"
import { Filter } from "./filter/filter.js"
import { GLFramebuffer } from "../gl/glframebuffer.js"
import { ToScreenFilter } from "./filter/toscreenfilter.js"

export class Renderer {
  gl: GL2Renderer
  framebuffers?:GLFramebuffer[]
  defaultContext:SceneContext
  prepared = false
  filters:Filter[] = []
  toscreen?:Filter

  constructor(container:string | HTMLCanvasElement | OffscreenCanvas | WebGL2RenderingContext, flags:number[]=[]) {
    this.gl = new GL2Renderer(container)
    this.defaultContext = new SceneContext(...flags)
  }

  addFilter(filter:Filter) {
    this.filters.push(filter)
    if (!this.toscreen) {
      this.toscreen = new ToScreenFilter()
    }
  }

  setViewport(width:number, height:number, x:number=0, y:number=0) {
    this.defaultContext.setViewport(width, height, x, y)
  }

  prepare(scene:Scene, camera?:Camera, context:SceneContext=this.defaultContext):Promise<void> {
    const textures:(Texture | CubeTexture)[] = []
    scene.eachMesh(mesh => {
      if (mesh.material?.texture) {
        textures.push(mesh.material.texture)
      }
      if (mesh.material?.cubeTexture) {
        textures.push(mesh.material.cubeTexture)
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
  
  preprocess(scene:Scene, camera?:Camera, context:SceneContext=this.defaultContext) {
    scene.eachMesh((mesh, i) => {
      if (mesh.material?.cubeTexture instanceof ReflectionTexture) {
        const reflectionTexture = mesh.material.cubeTexture
        if (camera) {
          reflectionTexture.render(scene, camera, context, mesh)
        } else {
          console.warn("no camera")
        }
      }
    })
  }

  render(scene:Scene, camera?:Camera, context:SceneContext=this.defaultContext, ignoreFilter:boolean=false) {
    if (!this.prepared) { // call only the first time
      this.prepare(scene, camera, context).then(() => {
        this.render(scene, camera, context, ignoreFilter)
      })
      return
    }

    if (!ignoreFilter && 0 < this.filters.length) {
      if (!this.framebuffers) {
        this.framebuffers = [
          new GLFramebuffer(this.gl.container.width, this.gl.container.height),
          new GLFramebuffer(this.gl.container.width, this.gl.container.height),
        ]
      }

      let cursor = 0
      context.context.framebuffer = this.framebuffers[cursor]
      context.needClear = false
      this.render(scene, camera, context, true)

      this.filters.forEach(filter => {
        cursor++
        const texture = context.context.framebuffer?.texture
        context.context.framebuffer = this.framebuffers![cursor % 2]
        filter.render(this.gl, this.framebuffers![cursor % 2], texture!)
      })

      const texture = context.context.framebuffer?.texture
      this.toscreen!.render(this.gl, null, texture)
      return
    }

    this.preprocess(scene, camera, context)

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
      if (mesh.hidden) return
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