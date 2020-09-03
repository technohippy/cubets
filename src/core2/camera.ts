import { ContextWriter } from "./contextwriter.js";
import { GLContext } from "../gl/glcontext.js";
import { GLUniform } from "../gl/gluniform.js";
import { Vec3 } from "../math/vec3.js";
import { Quat } from "../math/quat.js";

//@ts-ignore
import { glMatrix, mat4, vec3 } from "../../node_modules/gl-matrix/esm/index.js"
import { Renderer } from "./renderer.js";
glMatrix.setMatrixArrayType(Array)

export abstract class Camera implements ContextWriter {
  projectionMatrix:number[] = mat4.create()
  modelViewMatrix:number[] = mat4.create()
  normalMatrix:number[] = mat4.create()

  projectionMatrixUniform?:GLUniform
  modelViewMatrixUniform?:GLUniform
  normalMatrixUniform?:GLUniform

  position = new Vec3()
  rotation = new Quat()
  up = new Vec3(0, 1, 0)
  target?:Vec3

  #uploaded = false

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

  isSetupContextVars():boolean {
    return !!this.projectionMatrixUniform
  }

  setup(renderer:Renderer) {
    // for subclass
  }

  setupContextVars(config:{[key:string]:GLUniform}) {
    this.projectionMatrixUniform = config["projectionMatrix"]
    this.modelViewMatrixUniform = config["modelViewMatrix"]
    this.normalMatrixUniform = config["normalMatrix"]
  }

  writeContext(context:GLContext) {
    this.setupModelViewMatrix()

    this.projectionMatrixUniform?.updateValue(this.projectionMatrix)
    this.modelViewMatrixUniform?.updateValue(this.modelViewMatrix)
    this.normalMatrixUniform?.updateValue(this.normalMatrix)
    if (!this.#uploaded) {
      if (this.projectionMatrixUniform) {
        context.addUniform(this.projectionMatrixUniform)
      }
      if (this.modelViewMatrixUniform) {
        context.addUniform(this.modelViewMatrixUniform)
      }
      if (this.normalMatrixUniform) {
        context.addUniform(this.normalMatrixUniform)
      }
      this.#uploaded = true
    }
  }
}