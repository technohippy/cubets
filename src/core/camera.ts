import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js";
import { Filter, FilterChain } from "./filter.js";
import { Vec3 } from "../math/vec3.js";
import { Quat } from "../math/quat.js";
import { CameraControl } from "../control/cameracontrol.js";
import { Viewport } from "./viewport.js";

//@ts-ignore
import { glMatrix, mat4, vec3 } from "../../../node_modules/gl-matrix/esm/index.js"
import { PhongReflectionMaterial } from "./phong/phongreflectionmaterial.js";
import { Vec2 } from "../math/vec2.js";
glMatrix.setMatrixArrayType(Array)

export interface FilteredCamera {
  resetFilters(): void
  applyFilters(renderer:Renderer, fn:()=>void): void
  setupGLMatrixes(renderer:Renderer, scene:Scene): void
}

export abstract class Camera implements FilteredCamera {
  renderer: Renderer
  filters = new FilterChain()
  projectionMatrix: number[] = mat4.create()
  modelViewMatrix: number[] = mat4.create()
  cameraMatrix: number[] = mat4.create() // inverted modelViewMatrix
  normalMatrix: number[] = mat4.create()

  controls:CameraControl[] = []
  position = new Vec3()
  rotation = new Quat()
  up = new Vec3(0, 1, 0)
  target?: Vec3
  #starting = false

  constructor(viewport: Viewport | string) {
    if (typeof viewport === "string") {
      viewport = new Viewport(new Vec2(), new Vec2(1, 1), viewport)
    }
    this.renderer = new Renderer(viewport)
  }

  getAspectRatio(): number {
    return this.renderer.getAspectRatio()
  }

  addControl(control: CameraControl) {
    this.controls.push(control)
  }

  removeControl(control: CameraControl) {
    this.controls.splice(this.controls.indexOf(control), 1)
    control.detachEvents()
  }

  followTarget(target:Vec3) {
    this.target = target
  }

  resetTarget() {
    this.target = undefined
  }

  addFilter(filter: Filter) {
    filter.setupFrameBuffer(this.renderer)
    this.filters.push(filter)
  }

  removeFilter(filter: Filter) {
    throw "not yet"
  }

  resetFilters() {
    this.filters.forEach(f => {
      f.resetFrameBuffer()
    })
  }

  applyFilters(renderer:Renderer, fn:()=>void) {
    this.filters.apply(renderer, fn)
  }

  setupGLMatrixes(renderer:Renderer, scene:Scene) {
    const gl = renderer.gl
    const projectionMatrixLocation = scene.getProjectionMatrixUniformLocation(renderer)
    const modelViewMatrixLocation = scene.getModelViewMatrixUniformLocation(renderer)
    const cameraMatrixLocation = scene.getCameraMatrixUniformLocation(renderer)
    const normalMatrixLocation = scene.getNormalMatrixUniformLocation(renderer)
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, this.modelViewMatrix)
    gl.uniformMatrix4fv(cameraMatrixLocation, false, this.cameraMatrix)
    gl.uniformMatrix4fv(projectionMatrixLocation, false, this.projectionMatrix)
    gl.uniformMatrix4fv(normalMatrixLocation, false, this.normalMatrix)
  }

  abstract setupProjectionMatrix(): void

  setupModelViewMatrix() {
    const translationMat = mat4.create()
    mat4.translate(translationMat, translationMat, this.position.toArray())
    const rotationMat = mat4.create()
    if (this.target) {
      // ignore this.rotation
      // https://webglfundamentals.org/webgl/lessons/ja/webgl-3d-camera.html
      const zAxis = vec3.subtract(vec3.create(), this.position.toArray(), this.target.toArray())
      const xAxis = vec3.cross(vec3.create(), this.up.toArray(), zAxis)
      const yAxis = vec3.cross(vec3.create(), zAxis, xAxis)
      vec3.normalize(xAxis, xAxis)
      vec3.normalize(yAxis, yAxis)
      vec3.normalize(zAxis, zAxis)
      mat4.copy(rotationMat, [
        xAxis[0], xAxis[1], xAxis[2], 0,
        yAxis[0], yAxis[1], yAxis[2], 0,
        zAxis[0], zAxis[1], zAxis[2], 0,
        this.position.x, this.position.y, this.position.z, 1,
      ])
    } else {
      // ignore this.target
      mat4.fromQuat(rotationMat, this.rotation.toArray())
    }

    this.cameraMatrix = mat4.create()
    mat4.multiply(this.cameraMatrix, this.cameraMatrix, translationMat)
    mat4.multiply(this.cameraMatrix, this.cameraMatrix, rotationMat)

    mat4.invert(this.modelViewMatrix, this.cameraMatrix)

    // K = (M^-1)^T
    // K:normal matrix
    // M:model-view matrix
    mat4.copy(this.normalMatrix, this.modelViewMatrix)
    mat4.invert(this.normalMatrix, this.normalMatrix)
    mat4.transpose(this.normalMatrix, this.normalMatrix)
  }

  draw(scene: Scene) {
    if (!this.renderer.program) {
      this.renderer.prepareProgram(scene)
      this.renderer.use()
      this.renderer.setupLocations(scene)
    }

    this.setupProjectionMatrix()
    this.setupModelViewMatrix()

    // TODO: PhongReflectionMaterialが漏れているのでどうにかする
    scene.reflectionMeshes.forEach(mesh => {
      const reflectionMaterial = mesh.material as PhongReflectionMaterial
      reflectionMaterial.prepareCubeTexture(this.renderer, mesh)
    })

    this.renderer.render(scene, this)
  }

  async start(scene: Scene, loop:boolean=true) {
    if (this.#starting) return

    await scene.loadAllTextures()

    this.controls.forEach(control => {
      if (!control.camera) {
        control.setCamera(this)
      }
    });

    if (loop) this.#starting = true
    this._anim(scene)
  }

  startOnce(scene: Scene) {
    this.start(scene, false)
  }

  stop() {
    this.#starting = false
  }

  private _anim(scene: Scene) {
    this.draw(scene)
    if (this.#starting) requestAnimationFrame(() => this._anim(scene))
  }
}