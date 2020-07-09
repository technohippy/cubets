import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js";
import { Filter } from "./filter.js";

//@ts-ignore
import { glMatrix, mat4 } from "../../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export abstract class Camera {
  renderer: Renderer
  filters: Filter[] = []
  projectionMatrix: number[] = mat4.create()
  modelViewMatrix: number[] = mat4.create()
  normalMatrix: number[] = mat4.create()

  #starting = false

  constructor(renderer: Renderer | string) {
    if (typeof renderer === "string") {
      this.renderer = new Renderer(renderer)
    } else {
      this.renderer = renderer
    }
  }

  abstract setupProjectionMatrix(): void

  setupMatrixes() {
    this.setupProjectionMatrix()
    
    mat4.identity(this.modelViewMatrix)
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, 0, -20])

    mat4.copy(this.normalMatrix, this.modelViewMatrix)
    mat4.invert(this.normalMatrix, this.normalMatrix)
    mat4.transpose(this.normalMatrix, this.normalMatrix)
  }

  draw(scene: Scene) {
    this.setupMatrixes()
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