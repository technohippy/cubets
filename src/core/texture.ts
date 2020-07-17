export class Texture {
  image: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement

  constructor(image:string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement) {
    this.image = image
  }

  loadImage():Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof this.image === "string") {
        const image = new Image()
        image.onload = () => {
          this.image = image
          resolve()
        }
        image.src = this.image
      } else {
        resolve()
      }
    })
  }

  setupGLTexture(gl:WebGL2RenderingContext, location:WebGLUniformLocation) {
    if (typeof this.image === "string") {
      const img = new Image()
      img.onload = () => {
        this.image = img
        this.setupGLTexture(gl, location)
      }
      img.src = this.image
    } else {
      const texture = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      //gl.bindTexture(gl.TEXTURE_2D, null)

      gl.activeTexture(gl.TEXTURE0)
      //gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.uniform1i(location, 0)
    }
  }
}