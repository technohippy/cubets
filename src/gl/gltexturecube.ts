import { GLImage, GLImageSource } from "./glimage.js"
import { GLTexture, GLTextureParam } from "./gltexture.js"
import { GL2Renderer } from "./gl2renderer.js"
import { GLTexture2D } from "./gltexture2d.js"

export class GLTextureCube extends GLTexture {
  images:Map<number, GLImage | Function>

  constructor(type:number, images:(GLImage | Function)[] | Map<number, GLImage | GLImageSource | Function>, params:GLTextureParam={}) {
    super(type, params)

    if (Array.isArray(images)) {
      images = new Map([
        [WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X, images[0]],
        [WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X, images[1]],
        [WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y, images[2]],
        [WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y, images[3]],
        [WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z, images[4]],
        [WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z, images[5]],
      ])
    }

    this.images = new Map()
    images.forEach((image, target) => {
      if (image instanceof Function) {
        this.images.set(target, image)
      } else if (image instanceof GLImage) {
        this.images.set(target, image)
      } else {
        this.images.set(target, new GLImage(image))
      }
    })
  }
  
  setupFramebufferTexture(gl:GL2Renderer) {
    this.images.forEach((image, type) => {
      if (image instanceof GLImage) {
        const texture = new GLTexture2D(type, image)
        texture.texture = this.texture
        console.log("before setup fb", this.id)
        gl.setupFramebufferTexture(texture)
        if (gl.currentContext?.framebuffer) {
          gl.currentContext.framebuffer.updated = false
        }
        gl.draw(gl.currentProgram!, gl.currentContext!, true)
      } else if (image instanceof Function) {
        // TODO
      }
    })
    gl.uploadTextureCube(this)
  }
}