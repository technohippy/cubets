import { Light } from "./light.js";
import { GLUniform } from "../gl/gluniform.js";
import { GLContext } from "../gl/glcontext.js";
import { Vec3 } from "../math/vec3.js";
import { RGBAColor } from "../math/rgbacolor.js";

export class PhongDirectionalLight extends Light {
  shouldFollowCamera = false

  direction:Vec3
  diffuseColor:RGBAColor
  ambientColor:RGBAColor
  specularColor:RGBAColor

  shouldFollowCameraUniform?:GLUniform
  directionUniform?:GLUniform
  diffuseColorUniform?:GLUniform
  ambientColorUniform?:GLUniform
  specularColorUniform?:GLUniform

  isPositionalUniform?:GLUniform
  positionUniform?:GLUniform
  cutoffUniform?:GLUniform

  #uploaded = false

  constructor(direction:Vec3, diffuse:RGBAColor, ambient:RGBAColor, specular:RGBAColor=RGBAColor.Gray) {
    super()
    this.direction = direction
    this.diffuseColor = diffuse
    this.ambientColor = ambient
    this.specularColor = specular
  }

  setupContextVars(config:{[key:string]:GLUniform}) {
    this.isPositionalUniform = config["isPositional"]
    this.positionUniform = config["position"]
    this.cutoffUniform = config["cutoff"]

    this.shouldFollowCameraUniform = config["followCamera"]
    this.ambientColorUniform = config["ambient"]
    this.diffuseColorUniform = config["diffuse"]
    this.specularColorUniform = config["specular"]
    this.directionUniform = config["direction"]
  }

  writeContext(context:GLContext) {
    this.isPositionalUniform?.updateValue(0)
    this.positionUniform?.updateValue([0, 0, 0])
    this.cutoffUniform?.updateValue(1)
    this.shouldFollowCameraUniform?.updateValue(+this.shouldFollowCamera)
    if (this.diffuseColor) {
      this.diffuseColorUniform?.updateValue(this.diffuseColor.toArray())
    }
    if (this.ambientColor) {
      this.ambientColorUniform?.updateValue(this.ambientColor.toArray())
    }
    if (this.specularColor) {
      this.specularColorUniform?.updateValue(this.specularColor.toArray())
    }
    if (this.direction) {
      this.directionUniform?.updateValue(this.direction.toArray())
    }

    if (!this.#uploaded) {
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
      this.#uploaded = true
    }
  }
}