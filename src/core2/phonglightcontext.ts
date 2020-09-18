import { LightContext } from "./context/lightcontext.js";
import { GLUniform } from "../gl/gluniform.js";
import { GLContext } from "../gl/glcontext.js";
import { Light } from "./light.js";
import { PhongDirectionalLight } from "./phongdirectionallight.js";

export class PhongLightContext extends LightContext {
  shouldFollowCameraUniform?:GLUniform
  directionUniform?:GLUniform
  diffuseColorUniform?:GLUniform
  ambientColorUniform?:GLUniform
  specularColorUniform?:GLUniform

  isPositionalUniform?:GLUniform
  positionUniform?:GLUniform
  cutoffUniform?:GLUniform

  constructor(config:{[key:string]:GLUniform}) {
    super()
    this.isPositionalUniform = config["isPositional"]
    this.positionUniform = config["position"]
    this.cutoffUniform = config["cutoff"]

    this.shouldFollowCameraUniform = config["followCamera"]
    this.ambientColorUniform = config["ambient"]
    this.diffuseColorUniform = config["diffuse"]
    this.specularColorUniform = config["specular"]
    this.directionUniform = config["direction"]
  }

  upload(context:GLContext) {
    context.addUniform(this.isPositionalUniform!)
    context.addUniform(this.positionUniform!)
    context.addUniform(this.cutoffUniform!)
    if (this.shouldFollowCameraUniform) {
      context.addUniform(this.shouldFollowCameraUniform)
    }
    if (this.diffuseColorUniform) {
      context.addUniform(this.diffuseColorUniform)
    }
    if (this.ambientColorUniform) {
      context.addUniform(this.ambientColorUniform)
    }
    if (this.specularColorUniform) {
      context.addUniform(this.specularColorUniform)
    }
    if (this.directionUniform) {
      context.addUniform(this.directionUniform)
    }
  }

  write(light:Light, position:number=0) {
    if (light instanceof PhongDirectionalLight) {
      this.isPositionalUniform?.updateValue(0, position)
      this.positionUniform?.updateValue([0, 0, 0], position)
      this.cutoffUniform?.updateValue(1, position)
      this.shouldFollowCameraUniform?.updateValue(+light.shouldFollowCamera, position)
      if (light.diffuseColor) {
        this.diffuseColorUniform?.updateValue(light.diffuseColor.toArray(), position)
      }
      if (light.ambientColor) {
        this.ambientColorUniform?.updateValue(light.ambientColor.toArray(), position)
      }
      if (light.specularColor) {
        this.specularColorUniform?.updateValue(light.specularColor.toArray(), position)
      }
      if (light.direction) {
        this.directionUniform?.updateValue(light.direction.toArray(), position)
      }
    } else {
      throw `invalid type: ${light}`
    }
  }
}