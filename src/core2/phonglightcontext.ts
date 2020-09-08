import { LightContext } from "./context/lightcontext.js";
import { GLUniform } from "../gl/gluniform.js";

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
}