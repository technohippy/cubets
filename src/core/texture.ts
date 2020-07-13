export class Texture {
  image: string | HTMLImageElement

  constructor(image:string | HTMLImageElement) {
    this.image = image
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
      gl.bindTexture(gl.TEXTURE_2D, null)

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.uniform1i(location, 0)
    }
  }
}