import { CubeTexture } from "./cubetexture.js";
import { Scene } from "./scene.js";
import { Mesh } from "./mesh.js";
import { Renderer } from "./renderer.js";
import { Camera } from "./camera.js";
import { SceneContext } from "./context/scenecontext.js";
import { Vec3 } from "../math/vec3.js";
import { GLFramebuffer } from "../gl/glframebuffer.js";

export class ReflectionTexture extends CubeTexture {
  size:number
  framebuffer:GLFramebuffer

  renderer!:Renderer
  scene!:Scene
  baseCamera!:Camera
  context!:SceneContext
  mesh!:Mesh

  constructor(size:number=256) {
    super(
      () => { this.drawTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X, new Vec3(-1, 0, 0)) },
      () => { this.drawTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X, new Vec3(1, 0, 0)) },
      () => { this.drawTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y, new Vec3(0, -1, 0)) },
      () => { this.drawTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y, new Vec3(0, 1, 0)) },
      () => { this.drawTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z, new Vec3(0, 0, -1)) },
      () => { this.drawTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z, new Vec3(0, 0, 1)) },
    )
    this.size = size
    this.framebuffer = new GLFramebuffer(this.size, this.size, WebGL2RenderingContext.TEXTURE_CUBE_MAP)
  }

  loadImage():Promise<any> {
    // ignore
    return new Promise(resolve => resolve())
  }
  
  prepare(renderer:Renderer, scene:Scene, baseCamera:Camera, context:SceneContext, thisMesh:Mesh) {
    this.renderer = renderer
    this.scene = scene
    this.baseCamera = baseCamera
    this.context = context
    this.mesh = thisMesh
this.context.context.clearColor.b = 1
  }

  drawTexture(textureType:number, direction:Vec3) {
    const camera = this.baseCamera.clone()

    this.mesh.hidden = true

    camera.target = camera.position.clone().add(direction)

    this.framebuffer.texture.type = textureType
    this.framebuffer.updated = true
    this.context.context.framebuffer = this.framebuffer

    this.renderer.render(this.scene, camera, this.context)

    this.context.context.framebuffer = null
    this.mesh.hidden = false

  }
}