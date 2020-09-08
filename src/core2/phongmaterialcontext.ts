import { MaterialContext } from "./context/materialcontext.js";
import { PhongMaterialConfig } from "./phongmaterial.js";
import { GLUniform } from "../gl/gluniform.js";

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
}