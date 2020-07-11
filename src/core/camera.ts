import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js";
import { Filter } from "./filter.js";
import { Vec3 } from "../math/vec3.js";
import { Quat } from "../math/quat.js";

//@ts-ignore
import { glMatrix, mat4, vec3, quat } from "../../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export abstract class Camera {
  renderer: Renderer
  filters: Filter[] = []
  projectionMatrix: number[] = mat4.create()
  modelViewMatrix: number[] = mat4.create()
  normalMatrix: number[] = mat4.create()

  position = new Vec3()
  rotation = new Quat()
  target?: Vec3
  #starting = false

  constructor(renderer: Renderer | string) {
    if (typeof renderer === "string") {
      this.renderer = new Renderer(renderer)
    } else {
      this.renderer = renderer
    }
  }

  followTarget(target:Vec3) {
    this.target = target
  }

  resetTarget() {
    this.target = undefined
  }

  setupGLMatrixes(renderer:Renderer, scene:Scene) {
    const gl = renderer.gl
    const projectionMatrixLocation = scene.getProjectionMatrixUniformLocation(renderer)
    const modelViewMatrixLocation = scene.getModelViewMatrixUniformLocation(renderer)
    const normalMatrixLocation = scene.getNormalMatrixUniformLocation(renderer)
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, this.modelViewMatrix)
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
      const up = [0, 1, 0]
      const zAxis = vec3.subtract(vec3.create(), this.position.toArray(), this.target.toArray())
      const xAxis = vec3.cross(vec3.create(), up, zAxis)
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

    const cameraMat = mat4.create()
    mat4.multiply(cameraMat, cameraMat, translationMat)
    mat4.multiply(cameraMat, cameraMat, rotationMat)

    mat4.invert(this.modelViewMatrix, cameraMat)

    // K = (M^-1)^T
    // K:normal matrix
    // M:model-view matrix
    mat4.copy(this.normalMatrix, this.modelViewMatrix)
    mat4.invert(this.normalMatrix, this.normalMatrix)
    mat4.transpose(this.normalMatrix, this.normalMatrix)
  }

  draw(scene: Scene) {
    if (!this.renderer.isLocationsPrepared) {
      scene.prepareShaders(this.renderer)
    }

    this.setupProjectionMatrix()
    this.setupModelViewMatrix()

    this.renderer.render(scene, this)
  }

  start(scene: Scene) {
    if (this.#starting) return

    this.#starting = true
    this._anim(scene)
  }

  stop() {
    this.#starting = false
  }

  private _anim(scene: Scene) {
    this.draw(scene)
    if (this.#starting) requestAnimationFrame(() => this._anim(scene))
  }
}