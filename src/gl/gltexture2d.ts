import { GLTexture, GLTextureParam } from "./gltexture.js";
import { GLImage, GLImageSource } from "./glimage.js";

export class GLTexture2D extends GLTexture {
  image:GLImage | null

  constructor(type:number, image:GLImage | GLImageSource, params:GLTextureParam={}) {
    super(type, params)
    if (image instanceof GLImage) {
      this.image = image
    } else {
      this.image = new GLImage(image)
    }
  }
}