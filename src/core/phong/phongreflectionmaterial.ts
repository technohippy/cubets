import { Material } from "../material.js";
import { Mesh } from "../mesh.js";
import { Renderer } from "../renderer.js";
import { Scene } from "../scene.js";
import { Camera } from "../camera.js";
import { Quat } from "../../math/quat.js";
import { PhongMaterial } from "./phongmaterial.js";
import { CubeTexture } from "../cubetexture.js";
import { Vec3 } from "../../math/vec3.js";

export class PhongReflectionMaterial extends PhongMaterial {
  reflectionScene?: Scene
  reflectionCamera?: Camera

  prepareCubeTexture(renderer:Renderer, mesh:Mesh) {
    if (!this.reflectionCamera || !this.reflectionScene) throw("camera and scene must be set.")

    const nx = mesh.position.clone(); nx.x -= 1
    const px = mesh.position.clone(); px.x += 1
    const ny = mesh.position.clone(); ny.y -= 1 
    const py = mesh.position.clone(); py.y += 1
    const nz = mesh.position.clone(); nz.z -= 1
    const pz = mesh.position.clone(); pz.z += 1

    const gl = renderer.gl
    this.reflectionCamera.renderer = renderer
    this.reflectionCamera.position = mesh.position;

    // setup cubetexture
    const {frameBuffer, cubeTexture} = this.createFrameBuffer(renderer.gl)
    const cubeMapParams: [Vec3, GLenum][] = [
      [nx, gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
      [px, gl.TEXTURE_CUBE_MAP_POSITIVE_X],
      [ny, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
      [py, gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
      [nz, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z],
      [pz, gl.TEXTURE_CUBE_MAP_POSITIVE_Z]
    ]

    const reflectionMeshes = this.reflectionScene.reflectionMeshes // TODO: ここ強引なのでなんとかする
    this.reflectionScene.reflectionMeshes = [] // TODO: ここ強引なのでなんとかする
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
    cubeMapParams.forEach(([target, cubeMapDirection]) => {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, cubeMapDirection, cubeTexture, 0)
      this.reflectionCamera!.followTarget(target)
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