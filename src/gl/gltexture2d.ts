import { GLTexture } from "./gltexture.js";
import { GLImage, GLImageSource } from "./glimage.js";

export class GLTexture2D extends GLTexture {
  image:GLImage | null

  constructor(type:number, image:GLImage | GLImageSource, params:Map<string, number>=new Map()) {
    super(type, params)
    if (image instanceof GLImage) {
      this.image = image
    } else {
      this.image = new GLImage(image)
    }
  }
}