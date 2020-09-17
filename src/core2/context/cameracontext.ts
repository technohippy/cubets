import { GLUniform } from "../../gl/gluniform.js"
import { Camera } from "../camera.js"
import { GLContext } from "../../gl/glcontext.js"

export class CameraContext {
  projectionMatrixUniform?:GLUniform
  modelViewMatrixUniform?:GLUniform
  normalMatrixUniform?:GLUniform
  
  constructor(config:{[key:string]:GLUniform}) {
    this.projectionMatrixUniform = config["projectionMatrix"]
    this.modelViewMatrixUniform = config["modelViewMatrix"]
    this.normalMatrixUniform = config["normalMatrix"]
  }

  upload(context:GLContext) {
    if (this.projectionMatrixUniform) {
      context.addUniform(this.projectionMatrixUniform)
    }
    if (this.modelViewMatrixUniform) {
      context.addUniform(this.modelViewMatrixUniform)
    }
    if (this.normalMatrixUniform) {
      context.addUniform(this.normalMatrixUniform)
    }
  }

  write(context:GLContext, camera:Camera) {
    this.projectionMatrixUniform?.updateValue(camera.projectionMatrix)
    this.modelViewMatrixUniform?.updateValue(camera.modelViewMatrix)
    this.normalMatrixUniform?.updateValue(camera.normalMatrix)
    camera.writeContext(context) 
  }
}