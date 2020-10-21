export class CubeTexture {
  /** if true, this cube texture is used for skybox. */
  isSkybox = false

  images: (string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement)[]

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
    this.images = [ imageNx, imagePx, imageNy, imagePy, imageNz, imagePz ]
  }

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
}
