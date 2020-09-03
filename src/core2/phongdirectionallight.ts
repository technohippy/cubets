import { Light } from "./light.js";
import { GLUniform } from "../gl/gluniform.js";
import { GLContext } from "../gl/glcontext.js";
import { Vec3 } from "../math/vec3.js";
import { RGBAColor } from "../math/rgbacolor.js";

export class PhongDirectionalLight extends Light {
  shouldFollowCamera = false

  ambientColor:RGBAColor
  diffuseColor:RGBAColor
  specularColor:RGBAColor
  direction:Vec3

  ambientColorUniform?:GLUniform
  diffuseColorUniform?:GLUniform
  specularColorUniform?:GLUniform
  directionUniform?:GLUniform

  #uploaded = false

  constructor(params:{[key:string]:any}) {
    super()
    this.ambientColor = params["ambientColor"]
    this.diffuseColor = params["diffuseColor"]
    this.specularColor = params["specularColor"]
    this.direction = params["direction"]
  }

  setupContextVars(config:{[key:string]:GLUniform}) {
    this.ambientColorUniform = config["abmient"]
    this.diffuseColorUniform = config["diffuse"]
    this.specularColorUniform = config["specular"]
    this.directionUniform = config["direction"]
  }

  writeContext(context:GLContext) {
    if (this.diffuseColor) this.diffuseColorUniform?.updateValue(this.diffuseColor.toArray())
    if (this.ambientColor) this.ambientColorUniform?.updateValue(this.ambientColor.toArray())
    if (this.specularColor) this.specularColorUniform?.updateValue(this.specularColor.toArray())
    if (this.direction) this.directionUniform?.updateValue(this.direction.toArray())
    if (!this.#uploaded) {
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