export enum TextureType {
  Texture,
  CubeTexture,
  NormalTexture,
}

export class Texture {
  type: TextureType
  image: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement

  constructor(image:string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, type:TextureType=TextureType.Texture) {
    this.image = image
    this.type = type
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

  setupGLTexture(gl:WebGL2RenderingContext, location:WebGLUniformLocation, unit:number=0) {
    if (typeof this.image === "string") {
      const img = new Image()
      img.onload = () => {
        this.image = img
        this.setupGLTexture(gl, location)
      }
      img.src = this.image
    } else {
      const texture = gl.createTexture()!
      //@ts-ignore
      gl.activeTexture(gl[`TEXTURE${unit}`])
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)

      gl.uniform1i(location, unit)
    }
  }
}