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

  prepareCubeTexture(renderer:Renderer, mesh:Mesh) {
    if (!this.reflectionCamera || !this.reflectionScene) throw("camera and scene must be set.")

    const targetNx = mesh.position.clone().add(new Vec3(-1, 0, 0))
    const targetPx = mesh.position.clone().add(new Vec3(1, 0, 0))
    const targetNy = mesh.position.clone().add(new Vec3(0, -1, 0))
    const targetPy = mesh.position.clone().add(new Vec3(0, 1, 0))
    const targetNz = mesh.position.clone().add(new Vec3(0, 0, -1))
    const targetPz = mesh.position.clone().add(new Vec3(0, 0, 1))

    const gl = renderer.gl
    this.reflectionCamera.renderer.gl = renderer.gl
    this.reflectionCamera.renderer.vao = renderer.vao
    this.reflectionCamera.renderer.program = renderer.program
    this.reflectionCamera.renderer.attributeLocations = renderer.attributeLocations
    this.reflectionCamera.renderer.uniformLocations = renderer.uniformLocations
    this.reflectionCamera.position = mesh.position

    // setup cubetexture
    const {frameBuffer, cubeTexture} = this.createFrameBuffer(renderer.gl, this.reflectionCamera.renderer.viewport.size.x)
    const cubeMapParams: [GLenum, Vec3, Vec3][] = [
      [gl.TEXTURE_CUBE_MAP_NEGATIVE_X, targetNx, new Vec3(0, -1, 0)],
      [gl.TEXTURE_CUBE_MAP_POSITIVE_X, targetPx, new Vec3(0, -1, 0)],
      [gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, targetNy, new Vec3(0, 0, 1)],
      [gl.TEXTURE_CUBE_MAP_POSITIVE_Y, targetPy, new Vec3(0, 0, 1)],
      [gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, targetNz, new Vec3(0, -1, 0)],
      [gl.TEXTURE_CUBE_MAP_POSITIVE_Z, targetPz, new Vec3(0, -1, 0)]
    ]

    const reflectionMeshes = this.reflectionScene.reflectionMeshes // TODO: ここ強引なのでなんとかする
    this.reflectionScene.reflectionMeshes = [] // TODO: ここ強引なのでなんとかする
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
    cubeMapParams.forEach(([cubeMapDirection, target, up]) => {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, cubeMapDirection, cubeTexture, 0)
      this.reflectionCamera!.followTarget(target)
      this.reflectionCamera!.up = up
      this.reflectionCamera!.draw(this.reflectionScene!)
    })
    this.reflectionScene.reflectionMeshes = reflectionMeshes // TODO: ここ強引なのでなんとかする
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    const texture = new CubeTexture("d", "u", "m", "m", "y", "!") // TODO: ここ強引なのでなんとかする 
    texture.cubeTexture = cubeTexture
    this.texture = texture
  }

  setupGLVars(renderer:Renderer, mesh:Mesh) {
    super.setupGLVars(renderer, mesh)
    this.texture = undefined
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