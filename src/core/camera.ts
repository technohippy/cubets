import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js";
import { Filter, FilterChain } from "./filter.js";
import { Vec3 } from "../math/vec3.js";
import { Quat } from "../math/quat.js";
import { CameraControl } from "../control/cameracontrol.js";
import { Viewport } from "./viewport.js";
import { Vec2 } from "../math/vec2.js";
import { Picker } from "./picker.js";

//@ts-ignore
import { glMatrix, mat4, vec3 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

/**
 * @internal
 */
export interface FilteredCamera {
  resetFilters(): void
  applyFilters(renderer:Renderer, fn:()=>void): void
  setupGLMatrixes(renderer:Renderer, scene:Scene): void
}

/**
 * Represents a camera.
 * This is the starting point for rendering.
 */
export abstract class Camera implements FilteredCamera {
  /** @internal */
  renderer: Renderer

  /** @internal */
  filters = new FilterChain()

  /** @internal */
  projectionMatrix: number[] = mat4.create()

  /** @internal */
  modelViewMatrix: number[] = mat4.create()

  /** @internal */
  normalMatrix: number[] = mat4.create()

  /** @internal */
  controls:CameraControl[] = []

  /** @internal */
  picker?:Picker

  /** camera position */
  position = new Vec3()

  /** camera direction */
  rotation = new Quat()

  /** @internal */
  up = new Vec3(0, 1, 0)

  /** @internal */
  target?: Vec3

  /** @internal */
  #starting = false

  /**
   * Constructs a camera 
   * @param viewport the area where a scene is rendered in
   */
  constructor(viewport: Viewport | string) {
    if (typeof viewport === "string") {
      viewport = new Viewport(new Vec2(), new Vec2(1, 1), viewport)
    }
    this.renderer = new Renderer(viewport)
  }

  /**
   * Returns the viewport's aspect ratio (width/height)
   */
  getAspectRatio(): number {
    return this.renderer.getAspectRatio()
  }

  /**
   * Adds a camera control
   * @param control 
   */
  addControl(control: CameraControl) {
    this.controls.push(control)
  }

  /**
   * Removes a camera control
   * @param control 
   */
  removeControl(control: CameraControl) {
    this.controls.splice(this.controls.indexOf(control), 1)
    control.detachEvents()
  }

  /**
   * Sets a object picker
   * @param picker 
   */
  setPicker(picker: Picker) {
    this.picker = picker
  }

  /**
   * Sets a target for the camera to follow
   * @param target 
   */
  followTarget(target:Vec3) {
    this.target = target
  }

  /**
   * Rests a target for the camera to follow
   */
  resetTarget() {
    this.target = undefined
  }

  /**
   * Adds a filter (i.e. postprocessing)
   * @param filter 
   */
  addFilter(filter: Filter) {
    filter.setupRenderTarget(this.renderer)
    this.filters.push(filter)
  }

  /**
   * Removes a filter
   */
  removeFilter(filter: Filter) {
    throw "not yet"
  }

  /**
   * @internal
   */
  resetFilters() {
    this.filters.forEach(f => {
      f.resetFrameBuffer()
    })
  }

  /**
   * @internal
   */
  applyFilters(renderer:Renderer, fn:()=>void) {
    this.filters.apply(renderer, fn)
  }

  /**
   * @internal
   */
  setupGLMatrixes(renderer:Renderer, scene:Scene) {
    const gl = renderer.gl
    const projectionMatrixLocation = scene.getProjectionMatrixUniformLocation(renderer)
    const modelViewMatrixLocation = scene.getModelViewMatrixUniformLocation(renderer)
    const normalMatrixLocation = scene.getNormalMatrixUniformLocation(renderer)
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, this.modelViewMatrix)
    gl.uniformMatrix4fv(projectionMatrixLocation, false, this.projectionMatrix)
    gl.uniformMatrix4fv(normalMatrixLocation, false, this.normalMatrix)
  }

  /**
   * @internal
   */
  abstract setupProjectionMatrix(): void

  /**
   * @internal
   */
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

    const cameraMatrix = mat4.create()
    mat4.multiply(cameraMatrix, cameraMatrix, translationMat)
    mat4.multiply(cameraMatrix, cameraMatrix, rotationMat)

    mat4.invert(this.modelViewMatrix, cameraMatrix)

    // K = (M^-1)^T
    // K:normal matrix
    // M:model-view matrix
    mat4.copy(this.normalMatrix, this.modelViewMatrix)
    mat4.invert(this.normalMatrix, this.normalMatrix)
    mat4.transpose(this.normalMatrix, this.normalMatrix)
  }

  /**
   * Draws the given scene
   * @param scene 
   */
  draw(scene: Scene) {
    this.setupProjectionMatrix()
    this.setupModelViewMatrix()
    this.renderer.prepareRender(scene)
    this.renderer.render(scene, this)
  }

  /**
   * Prepares and draw the given scene
   * @param scene 
   * @param loop if true repeat drawing, if false draw once
   */
  async start(scene: Scene, loop:boolean=true) {
    if (this.#starting) return

    await scene.loadAllTextures()

    if (this.picker) {
      this.picker.setup(this, scene)      
    }

    this.controls.forEach(control => {
      if (!control.camera) {
        control.setCamera(this)
      }
    });

    if (loop) this.#starting = true
    this._anim(scene)
  }

  /**
   * Draws the given scene once
   */
  startOnce(scene: Scene) {
    this.start(scene, false)
  }

  /**
   * Stops drawing
   */
  stop() {
    this.#starting = false
  }

  /**
   * Repeats rendering the given scene
   * @param scene 
   */
  private _anim(scene: Scene) {
    this.draw(scene)
    if (this.#starting) requestAnimationFrame(() => this._anim(scene))
  }
}