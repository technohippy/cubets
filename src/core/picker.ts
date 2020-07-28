import { Scene } from "./scene.js";
import { Camera } from "./camera.js";
import { Mesh } from "./mesh.js";
import { PhongMaterial } from "./phong/phongmaterial.js";
import { RGBAColor } from "../math/rgbacolor.js";
import { Renderer } from "./renderer.js";
import { RenderTarget } from "./rendertarget.js";

export class Picker {
  camera?: Camera
  scene?: Scene
  container?: HTMLCanvasElement
  renderer?: Renderer
  handler: (mesh:Mesh) => void

  renderTarget?: RenderTarget

  constructor(handler: (mesh:Mesh) => void) {
    this.handler = handler
  }

  setup(camera:Camera, scene:Scene) {
    this.camera = camera
    this.scene = scene
    this.renderer = camera.renderer.renew()
    this.renderer.overrideMaterial = new PickerMaterial()

    this.container = camera.renderer.container    
    this.container?.addEventListener("click", evt => {
      this.pickObject(evt.offsetX, this.container?.clientHeight! -  evt.offsetY)
    })
  }

  pickObject(x:number, y:number) {
    const gl = this.renderer!.gl!
    const pixel = new Uint8Array(1 * 1 * 4)

    this.setupFrameBuffer(gl)

    // TODO: Camera#drawを無理やり分解
    this.camera?.setupProjectionMatrix()
    this.camera?.setupModelViewMatrix()
    this.renderer?.prepareRender(this.scene!)
    this.renderer?.render(this.scene!, this.camera!)

    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)
    this.resetFrameBuffer(gl)

    const id = 255 * 255 * pixel[0] + 255 * pixel[1] + pixel[2]
    let found:Mesh | null = null
    this.scene?.eachMesh(mesh => {
      if (mesh.id === id) found = mesh
    })
    if (found) this.handler(found)
  }

  setupFrameBuffer(gl:WebGL2RenderingContext) {
    if (!this.renderTarget) {
      const { width, height } = this.container!
      this.renderTarget = new RenderTarget(width, height)
      this.renderTarget.setup(gl)
    }
    this.renderTarget.apply(gl)
  }

  resetFrameBuffer(gl:WebGL2RenderingContext) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
}

class PickerMaterial extends PhongMaterial { // TODO
  setColor(color:RGBAColor) { }
  prepare(renderer:Renderer, mesh:Mesh) { }

  setupGLVars(renderer:Renderer, mesh:Mesh) {
    const color = RGBAColor.fromNumber(mesh.id)
    const gl = renderer.gl
    const ignoreLightingLocation = renderer.getUniformLocation("uIgnoreLightingMode")
    const materialDiffuseLocation = renderer.getUniformLocation("uMaterialDiffuse")
    gl.uniform4fv(materialDiffuseLocation, color.toArray())
    gl.uniform1i(ignoreLightingLocation, 1)
  }
}