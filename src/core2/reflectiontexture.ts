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

  constructor(size:number=256) {
    super(
      new Image(size, size),
      new Image(size, size), 
      new Image(size, size), 
      new Image(size, size), 
      new Image(size, size), 
      new Image(size, size),
    )
    this.size = size
    this.framebuffer = new GLFramebuffer(size, size)
  }

  loadImage():Promise<any> {
    // ignore
    return new Promise(resolve => resolve())
  }

  render(renderer:Renderer, scene:Scene, baseCamera:Camera, context:SceneContext, thisMesh:Mesh) {
    const camera = baseCamera.clone()
    thisMesh.hidden = true
    const targets = new Map([
      [WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X, new Vec3(-1, 0, 0)],
      [WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X, new Vec3(1, 0, 0)],
      [WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y, new Vec3(0, -1, 0)],
      [WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y, new Vec3(0, 1, 0)],
      [WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z, new Vec3(0, 0, -1)],
      [WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z, new Vec3(0, 0, 1)],
    ])
    targets.forEach((cameraTarget, framebufferTarget) => {
      camera.target = camera.position.clone().add(cameraTarget)
      this.framebuffer.texture.type = framebufferTarget
      context.context.framebuffer = this.framebuffer
      renderer.render(scene, camera, context)
    })
    context.context.framebuffer = null
    thisMesh.hidden = false
  }
}