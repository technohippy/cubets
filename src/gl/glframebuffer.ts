import { GLTexture } from "./gltexture.js"
import { GL2Renderer } from "./gl2renderer.js"
import { GLImage } from "./glimage.js"

export class GLFramebuffer {
  framebuffer?: WebGLFramebuffer

  texture:GLTexture
  
  constructor(width:number, height:number) {
    const imageParams = new Map<string, number>()
    imageParams.set("width", width)
    imageParams.set("height", height)
    const image = new GLImage(null, imageParams)
    this.texture = new GLTexture(WebGLRenderingContext.TEXTURE_2D, image)
    this.texture.minFilter = WebGLRenderingContext.NEAREST
    this.texture.magFilter = WebGLRenderingContext.NEAREST
  }

  prepared(): boolean {
    return !!this.framebuffer
  }

  prepare(renderer:GL2Renderer) {
    this.framebuffer = renderer.createFramebuffer(this)
  }
}