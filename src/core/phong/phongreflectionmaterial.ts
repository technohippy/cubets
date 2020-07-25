import { Mesh } from "../mesh.js";
import { Renderer } from "../renderer.js";
import { Scene } from "../scene.js";
import { Camera } from "../camera.js";
import { PhongMaterial } from "./phongmaterial.js";
import { CubeTexture } from "../cubetexture.js";
import { Vec3 } from "../../math/vec3.js";

export class PhongReflectionMaterial extends PhongMaterial {
  reflectionScene?: Scene
  reflectionCamera?: Camera

  prepare(renderer:Renderer, mesh:Mesh) {
    if (!this.reflectionCamera || !this.reflectionScene) throw("camera and scene must be set.")

    this.reflectionCamera.renderer.copyGLCachesFrom(renderer)
    this.reflectionCamera.position = mesh.position
    const gl = this.reflectionCamera.renderer.gl

    const {frameBuffer, cubeTexture} = this.createFrameBuffer(renderer.gl, this.reflectionCamera.renderer.viewport.size.x)
    const cubeMapParams: [GLenum, Vec3, Vec3][] = [
      [gl.TEXTURE_CUBE_MAP_NEGATIVE_X, new Vec3(-1, 0, 0), new Vec3(0, -1, 0)],
      [gl.TEXTURE_CUBE_MAP_POSITIVE_X, new Vec3(1, 0, 0), new Vec3(0, -1, 0)],
      [gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, new Vec3(0, -1, 0), new Vec3(0, 0, 1)],
      [gl.TEXTURE_CUBE_MAP_POSITIVE_Y, new Vec3(0, 1, 0), new Vec3(0, 0, 1)],
      [gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, new Vec3(0, 0, -1), new Vec3(0, -1, 0)],
      [gl.TEXTURE_CUBE_MAP_POSITIVE_Z, new Vec3(0, 0, -1), new Vec3(0, -1, 0)]
    ]

    this.reflectionScene.reflectionMeshes.forEach(m => {
      m.hidden = true
      m.material.skipPrepare = true
    })
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
    cubeMapParams.forEach(([cubeMapDirection, dir, up]) => {
      const target = mesh.position.clone().add(dir)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, cubeMapDirection, cubeTexture, 0)
      this.reflectionCamera!.followTarget(target)
      this.reflectionCamera!.up = up
      this.reflectionCamera!.draw(this.reflectionScene!)
    })
    this.reflectionScene.reflectionMeshes.forEach(m => {
      m.hidden = false
      m.material.skipPrepare = false
    })
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    this.cubeTexture = new ReflectionCubeTexture(cubeTexture)
  }

  setupGLVars(renderer:Renderer, mesh:Mesh) {
    super.setupGLVars(renderer, mesh)
    this.clearTexture()
  }

  createFrameBuffer(gl:WebGL2RenderingContext, size:number=256): {frameBuffer:WebGLFramebuffer, cubeTexture:WebGLTexture} {
    const frameBuffer = gl.createFramebuffer()
    if (!frameBuffer) {
      throw "frameBuffer is null"
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)

    const cubeTexture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeTexture)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)

    const renderbuffer = gl.createRenderbuffer()!
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size, size)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer)

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    return {frameBuffer, cubeTexture}
  }
}

class ReflectionCubeTexture extends CubeTexture {
  constructor(cubeTexture: WebGLTexture) {
    super("", "", "", "", "", "")
    this.cubeTexture = cubeTexture
  }
  
  setupGLTexture(gl:WebGL2RenderingContext, location:WebGLUniformLocation, skyboxLocation?:WebGLUniformLocation) {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeTexture!)
    gl.activeTexture(gl.TEXTURE0)
    gl.uniform1i(location, 0)

    if (skyboxLocation) {
      gl.uniform1i(skyboxLocation, this.isSkybox ? 1 : 0)
    }
  }
}