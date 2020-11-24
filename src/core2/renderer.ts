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
import { GLTexture2D } from "../gl/gltexture2d.js"
import { GLTextureCube } from "../gl/gltexturecube.js"
import { GLImage } from "../gl/glimage.js"

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

  // run once
  prepare(scene:Scene, camera?:Camera, context:SceneContext=this.defaultContext):Promise<void> {
    const textures:(Texture | CubeTexture)[] = []
    scene.eachMesh(mesh => {
      if (mesh.material?.texture) {
        textures.push(mesh.material.texture)
      }
      if (mesh.material?.cubeTexture) {
        if (mesh.material.cubeTexture instanceof ReflectionTexture) {
          const reflectionTexture = mesh.material.cubeTexture
          if (camera) {
            reflectionTexture.prepare(this, scene, camera, context, mesh)
          } else {
            console.warn("no camera")
          }
        }
        textures.push(mesh.material.cubeTexture)
      }
    })
    return Promise.all(textures.map(t => t.loadImage())).then(() => {
      if (camera && !camera.isSetupContextVars()) {
        camera.setupContextVars(scene.cameraConfig())
      }

      if (!context.prepared) {
        context.setupVars(scene, camera)
      }

      this.prepared = true
    })
  }
 
  render(scene:Scene, camera?:Camera, context:SceneContext=this.defaultContext, ignoreFilter:boolean=false, ignoreReflect:boolean=false) {
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

      let cursor = false
      context.context.framebuffer = this.framebuffers[+cursor]
      context.needClear = false
      this.render(scene, camera, context, true)

      this.filters.forEach(filter => {
        const texture = this.framebuffers![+cursor].texture as GLTexture2D
        cursor = !cursor
        filter.render(this.gl, this.framebuffers![+cursor], texture!)
      })

      const texture = this.framebuffers![+cursor].texture as GLTexture2D
      this.toscreen!.render(this.gl, null, texture)
      return
    }

    // 鏡面反射用のコード（未完成）。有効にするとフィルタが適用されなくなる
    /*
    if (!ignoreReflect) {
      scene.eachMesh((mesh, i) => {
        if (mesh.material?.cubeTexture instanceof ReflectionTexture) {
          //mesh.material.cubeTexture.renderToTextures(this)
          const tex = mesh.material.cubeTexture
          const glTex = new GLTextureCube(WebGL2RenderingContext.TEXTURE_CUBE_MAP, [
            new GLImage(null, {width:tex.size, height:tex.size}),
            new GLImage(null, {width:tex.size, height:tex.size}),
            new GLImage(null, {width:tex.size, height:tex.size}),
            new GLImage(null, {width:tex.size, height:tex.size}),
            new GLImage(null, {width:tex.size, height:tex.size}),
            new GLImage(null, {width:tex.size, height:tex.size}),
          ], {
            magFilter:WebGL2RenderingContext.LINEAR,
            minFilter:WebGL2RenderingContext.LINEAR,
          })
          context.context.framebuffer = new GLFramebuffer(tex.size, tex.size, glTex)
          context.context.framebuffer.updated = true
          context.needClear = false
          scene.removeMesh(mesh)
          this.render(scene, camera, context, ignoreFilter, true)
          scene.addMesh(mesh)
        }
      })
      context.context.framebuffer = null
    }
    */

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