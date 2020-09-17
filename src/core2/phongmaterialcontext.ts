import { MaterialContext } from "./context/materialcontext.js";
import { PhongMaterialConfig, PhongMaterial } from "./phongmaterial.js";
import { GLUniform } from "../gl/gluniform.js";
import { GLContext } from "../gl/glcontext.js";
import { Material } from "./material.js";

export class PhongMaterialContext extends MaterialContext {
  diffuseColorUniform?:GLUniform
  ambientColorUniform?:GLUniform
  specularColorUniform?:GLUniform
  shininessUniform?:GLUniform

  constructor(config:PhongMaterialConfig) {
    super()
    this.diffuseColorUniform = config["diffuse"]
    this.ambientColorUniform = config["ambient"]
    this.specularColorUniform = config["specular"]
    this.shininessUniform = config["shininess"]
  }

  upload(context:GLContext) {
    if (this.diffuseColorUniform) {
      this.diffuseColorUniform?.updateValue([1, 1, 1, 1]) // TODO: default
      context.addUniform(this.diffuseColorUniform)
    }
    if (this.ambientColorUniform) {
      this.ambientColorUniform?.updateValue([1, 1, 1, 1]) // TODO: default
      context.addUniform(this.ambientColorUniform)
    }
    if (this.specularColorUniform) {
      this.specularColorUniform?.updateValue([1, 1, 1, 1]) // TODO: default
      context.addUniform(this.specularColorUniform)
    }
    if (this.shininessUniform) {
      this.shininessUniform?.updateValue(0) // TODO: default
      context.addUniform(this.shininessUniform)
    }
  }

  write(material:Material) {
    if (material instanceof PhongMaterial) {
      this.diffuseColorUniform?.updateValue(material.diffuseColor.toArray())
      this.ambientColorUniform?.updateValue(material.ambientColor.toArray())
      this.specularColorUniform?.updateValue(material.specularColor.toArray())
      this.shininessUniform?.updateValue(material.shininess)
    } else {
      throw `invalid type: ${material}`
    }
  }
}