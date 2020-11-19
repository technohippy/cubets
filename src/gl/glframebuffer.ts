import { GLTexture2D } from "./gltexture2d.js"
import { GL2Renderer } from "./gl2renderer.js"
import { GLImage } from "./glimage.js"
import { GLTexture } from "./gltexture.js"
import { GLTextureCube } from "./gltexturecube.js"
import { Texture } from "../core2/texture.js"

export class GLFramebuffer {
  framebuffer: WebGLFramebuffer | null = null

  width:number
  height:number
  texture!:GLTexture
  target = WebGL2RenderingContext.TEXTURE_2D
  updated = true

  constructor(width:number, height:number, textureType:GLenum | GLTexture = WebGLRenderingContext.TEXTURE_2D) {
    this.width = width
    this.height = height
    if (textureType instanceof GLTexture) {
      this.texture = textureType
    } else if (textureType === WebGL2RenderingContext.TEXTURE_2D) {
      const image = new GLImage(null, {
        width: width,
        height: height,
      })
      this.texture = new GLTexture2D(textureType, image)
      this.texture.minFilter = WebGLRenderingContext.NEAREST
      this.texture.magFilter = WebGLRenderingContext.NEAREST
      this.texture.wrapS = WebGLRenderingContext.CLAMP_TO_EDGE
      this.texture.wrapT = WebGLRenderingContext.CLAMP_TO_EDGE
    } else {
      throw `wrong texture type ${textureType}`
    }
  }

  prepared(): boolean {
    return !!this.framebuffer
  }

  prepare(renderer:GL2Renderer) {
    this.framebuffer = renderer.setupFramebuffer(this)
  }
}