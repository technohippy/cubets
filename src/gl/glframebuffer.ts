import { GLTexture } from "./gltexture.js"

export class GLFramebuffer {
  width:number
  height:number
  texture:GLTexture
  
  constructor(width:number, height:number) {
    this.width = width
    this.height = height
    this.texture = new GLTexture(WebGLRenderingContext.TEXTURE_2D, null)
  }
}