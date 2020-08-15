import { GLImage, GLImageSource } from "./glimage.js"
import { GLTexture } from "./gltexture.js"

export class GLTextureCube extends GLTexture {
  images:Map<number, GLImage>

  constructor(type:number, images:Map<number, GLImage | GLImageSource>, params:Map<string, number>=new Map()) {
    super(type, params)

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