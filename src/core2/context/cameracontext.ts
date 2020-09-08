import { GLUniform } from "../../gl/gluniform.js"

export class CameraContext {
  projectionMatrixUniform?:GLUniform
  modelViewMatrixUniform?:GLUniform
  normalMatrixUniform?:GLUniform
  
  constructor(config:{[key:string]:GLUniform}) {
    this.projectionMatrixUniform = config["projectionMatrix"]
    this.modelViewMatrixUniform = config["modelViewMatrix"]
    this.normalMatrixUniform = config["normalMatrix"]
  }
}