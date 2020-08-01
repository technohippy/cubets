import { Texture, TextureType } from "./texture.js";

export class CubeTexture implements Texture {
  /** must be {@link TextureType.CubeTexture} */
  type: TextureType

  /** if true, this cube texture is used for skybox. */
  isSkybox = false

  /** @internal */
  image: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
  
  /** @internal */
  images: (string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement)[]

  /** @internal */
  cubeTexture?: WebGLTexture

  /**
   * Constructs a cube texture
   * @param imageNx image source for negative X plane
   * @param imagePx image source for positive X plane
   * @param imageNy image source for negative Y plane
   * @param imagePy image source for positive Y plane
   * @param imageNz image source for negative Z plane
   * @param imagePz image source for positive Z plane
   */
  constructor(
    imageNx:string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
    imagePx:string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
    imageNy:string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
    imagePy:string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
    imageNz:string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
    imagePz:string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  ) {
    this.image = imageNx // TODO
    this.images = [ imageNx, imagePx, imageNy, imagePy, imageNz, imagePz ]
    this.type = TextureType.CubeTexture
  }

  /** @internal */
  loadImage():Promise<any> {
    return Promise.all(
      this.images.map((image, i) => {
        return new Promise((resolve, reject) => {
          if (typeof image === "string") {
            const img = new Image()
            img.onload = () => {
              this.images[i] = img
              resolve()
            }
            img.src = image
          } else {
            resolve()
          }
        })
      })
    )
  }

  /** @internal */
  setupGLTexture(gl:WebGL2RenderingContext, location:WebGLUniformLocation, skyboxLocation?:WebGLUniformLocation) {
    if (!this.cubeTexture) {
      this.images.forEach((image, i) => {
        if (typeof image === "string") {
          const img = new Image()
          img.src = image
          this.images[i] = img
        }
      })

      this.cubeTexture = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeTexture)
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

      gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[0] as (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement))
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[1] as (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement))
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[2] as (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement))
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[3] as (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement))
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[4] as (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement))
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[5] as (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement))
    } else {
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeTexture)
    }

    gl.activeTexture(gl.TEXTURE0)
    gl.uniform1i(location, 0)

    if (skyboxLocation) {
      gl.uniform1i(skyboxLocation, this.isSkybox ? 1 : 0)
    }
    this.cubeTexture = undefined
  }
}
