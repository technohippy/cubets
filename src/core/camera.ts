import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js";
import { Filter } from "./filter.js";

//@ts-ignore
import { glMatrix, mat4 } from "../../../node_modules/gl-matrix/esm/index.js"
import { Vec3 } from "../math/vec3.js";
glMatrix.setMatrixArrayType(Array)

export abstract class Camera {
  renderer: Renderer
  filters: Filter[] = []
  projectionMatrix: number[] = mat4.create()
  modelViewMatrix: number[] = mat4.create()
  normalMatrix: number[] = mat4.create()

  position = new Vec3(0, 0, 20)
  #starting = false

  constructor(renderer: Renderer | string) {
    if (typeof renderer === "string") {
      this.renderer = new Renderer(renderer)
    } else {
      this.renderer = renderer
    }
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
    mat4.identity(this.modelViewMatrix)
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, 0, -20])

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