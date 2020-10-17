import { LightContext } from "./context/lightcontext.js";
import { GLUniform } from "../gl/gluniform.js";
import { GLContext } from "../gl/glcontext.js";
import { Light } from "./light.js";
import { PhongLight } from "./phonglight.js";

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
    if (this.positionUniform) {
      context.addUniform(this.positionUniform!)
    }
    if (this.cutoffUniform) {
      context.addUniform(this.cutoffUniform!)
    }
  }

  write(light:Light, position:number=0) {
    if (light instanceof PhongLight) {
      this.isPositionalUniform?.updateValue(light.type !== "directional" ? 1 : 0, position)

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
      if (light.position) {
        this.positionUniform?.updateValue(light.position.toArray(), position)
      }
      
      this.cutoffUniform?.updateValue(1, position)
      if (light.cutoff) {
        this.cutoffUniform?.updateValue(light.cutoff, position)
      }
    } else {
      throw `invalid type: ${light}`
    }
  }
}