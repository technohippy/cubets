import { GLTexture2D } from "./gltexture2d.js"
import { GL2Renderer } from "./gl2renderer.js"
import { GLImage } from "./glimage.js"

export class GLFramebuffer {
  framebuffer: WebGLFramebuffer | null = null

  texture:GLTexture2D
  target = WebGL2RenderingContext.TEXTURE_2D

  constructor(width:number, height:number) {
    const image = new GLImage(null, {
      width: width,
      height: height,
    })
    this.texture = new GLTexture2D(WebGLRenderingContext.TEXTURE_2D, image)
    this.texture.minFilter = WebGLRenderingContext.NEAREST
    this.texture.magFilter = WebGLRenderingContext.NEAREST
    this.texture.wrapS = WebGLRenderingContext.CLAMP_TO_EDGE
    this.texture.wrapT = WebGLRenderingContext.CLAMP_TO_EDGE
  }

  prepared(): boolean {
    return !!this.framebuffer
  }

  prepare(renderer:GL2Renderer) {
    this.framebuffer = renderer.setupFramebuffer(this)
  }
}