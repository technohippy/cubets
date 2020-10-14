export class Texture {
  src?: string
  image?: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
  
  constructor(image:string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement) {
    if (typeof image === "string") {
      this.src = image
    } else {
      this.image = image
    }
  }

  loadImage():Promise<void> {
    return new Promise(resolve => {
      if (typeof this.src === "string") {
        this.image = new Image()
        this.image.onload = () => {
          resolve()
        }
        this.image.src = this.src
      } else {
        resolve()
      }
    })
  }
}