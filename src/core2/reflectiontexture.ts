import { CubeTexture } from "./cubetexture.js";
import { Scene } from "./scene.js";
import { Mesh } from "./mesh.js";
import { Renderer } from "./renderer.js";
import { Camera } from "./camera.js";
import { SceneContext } from "./context/scenecontext.js";
import { Vec3 } from "../math/vec3.js";
import { GLFramebuffer } from "../gl/glframebuffer.js";
import { GLTextureCube } from "../gl/gltexturecube.js";
import { GLImage } from "../gl/glimage.js";
import { GLTexture2D } from "../gl/gltexture2d.js";

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
      new GLImage(null, {width:size, height:size}),
      new GLImage(null, {width:size, height:size}),
      new GLImage(null, {width:size, height:size}),
      new GLImage(null, {width:size, height:size}),
      new GLImage(null, {width:size, height:size}),
      new GLImage(null, {width:size, height:size}),
    )
    this.size = size
    const texturecube = new GLTextureCube(
      WebGL2RenderingContext.TEXTURE_CUBE_MAP, [
        new GLImage(null, {width:size, height:size}),
        new GLImage(null, {width:size, height:size}),
        new GLImage(null, {width:size, height:size}),
        new GLImage(null, {width:size, height:size}),
        new GLImage(null, {width:size, height:size}),
        new GLImage(null, {width:size, height:size}),
      ], 
      {magFilter:WebGL2RenderingContext.LINEAR, minFilter:WebGL2RenderingContext.LINEAR}
    )
    this.framebuffer = new GLFramebuffer(this.size, this.size, texturecube)
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
  }

  renderToTextures(renderer:Renderer) {
    this.mesh.hidden = true
    this.scene.removeMesh(this.mesh)

    const directions = new Map([
      [WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X, new Vec3(-1, 0, 0)],
      [WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X, new Vec3(1, 0, 0)],
      [WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y, new Vec3(0, -1, 0)],
      [WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y, new Vec3(0, 1, 0)],
      [WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z, new Vec3(0, 0, -1)],
      [WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z, new Vec3(0, 0, 1)],
    ])
    directions.forEach((vec, type) => {
      console.log("<<<<<<<")
      const camera = this.baseCamera.clone()
      camera.target = camera.position.clone().add(vec)
      const texture = new GLTexture2D(type, new GLImage(null, {width:this.size, height:this.size}))
      this.framebuffer.texture = texture
      this.context.context.framebuffer = this.framebuffer
      this.framebuffer.updated = true
      this.renderer.render(this.scene, camera, this.context)
    })

    this.context.context.framebuffer = null
    this.mesh.hidden = false
    this.scene.addMesh(this.mesh)
  }
}