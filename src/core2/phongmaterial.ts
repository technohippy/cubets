import { Material } from "./material.js";
import { RGBAColor } from "../math/rgbacolor.js";
import { GLContext } from "../gl/glcontext.js";
import { GLUniform } from "../gl/gluniform.js";
import { PhongMaterialContext } from "./phongmaterialcontext.js";
import { MaterialContext } from "./context/materialcontext.js";

type PhongMaterialConfigKey = "diffuse" | "ambient" | "specular" | "shininess"
export type PhongMaterialConfig = {[key in PhongMaterialConfigKey]?:GLUniform}

export class PhongMaterial extends Material {
  diffuseColor: RGBAColor
  ambientColor: RGBAColor
  specularColor: RGBAColor
  shininess: number
  pointSize?: number // only for particles

  diffuseColorUniform?:GLUniform
  ambientColorUniform?:GLUniform
  specularColorUniform?:GLUniform
  shininessUniform?:GLUniform
  
  #uploaded = false

  constructor(
    diffuseColor: RGBAColor=RGBAColor.random(),
    ambientColor: RGBAColor=RGBAColor.Gray,
    specularColor: RGBAColor=RGBAColor.White,
    shininess: number = 100,
  ) {
    super()
    this.diffuseColor = diffuseColor
    this.ambientColor = ambientColor
    this.specularColor = specularColor
    this.shininess = shininess
  }

  setupContext(config:PhongMaterialConfig):MaterialContext {
    return new PhongMaterialContext(config)
  }

  setupContextVars(config:PhongMaterialConfig) {
    this.diffuseColorUniform = config["diffuse"]
    this.ambientColorUniform = config["ambient"]
    this.specularColorUniform = config["specular"]
    this.shininessUniform = config["shininess"]
  }

  writeContext(context:GLContext) {
    this.diffuseColorUniform?.updateValue(this.diffuseColor.toArray())
    this.ambientColorUniform?.updateValue(this.ambientColor.toArray())
    this.specularColorUniform?.updateValue(this.specularColor.toArray())
    this.shininessUniform?.updateValue(this.shininess)
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
      if (this.shininessUniform) {
        context.addUniform(this.shininessUniform)
      }
      this.#uploaded = true
    }
  }
}