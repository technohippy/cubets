import { GLImage, GLImageSource } from "./glimage.js"
import { GLTexture } from "./gltexture.js"

export class GLTextureCube extends GLTexture {
  images:Map<number, GLImage>

  constructor(type:number, images:GLImage[] | Map<number, GLImage | GLImageSource>, params:Map<string, number>=new Map()) {
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
      if (image instanceof GLImage) {
        this.images.set(target, image)
      } else {
        this.images.set(target, new GLImage(image))
      }
    })
  }
}