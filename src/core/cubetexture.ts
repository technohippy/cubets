import { Texture } from "./texture.js";

export class CubeTexture implements Texture {
  image: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
  images: (string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement)[]

  isSkybox = false

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

  setupGLTexture(gl:WebGL2RenderingContext, location:WebGLUniformLocation, skyboxLocation?:WebGLUniformLocation) {
    this.images.forEach((image, i) => {
      if (typeof image === "string") {
        const img = new Image()
        img.src = image
        this.images[i] = img
      }
    })

    const cubeTexture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[0] as (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement))
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[1] as (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement))
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[2] as (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement))
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[3] as (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement))
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[4] as (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement))
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[5] as (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement))

    gl.activeTexture(gl.TEXTURE0)
    gl.uniform1i(location, 0)

    if (skyboxLocation) {
      gl.uniform1i(skyboxLocation, this.isSkybox ? 1 : 0)
    }
  }
}
