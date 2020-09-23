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
    this.wireframeUniform = config["wireframe"]
    this.normalUniform = config["normal"]
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
    if (this.wireframeUniform) {
      this.wireframeUniform?.updateValue(0) // TODO: default
      context.addUniform(this.wireframeUniform)
    }
    if (this.normalUniform) {
      this.normalUniform?.updateValue(0) // TODO: default
      context.addUniform(this.normalUniform)
    }
  }

  write(context:GLContext, material:Material) {
    if (material instanceof PhongMaterial) {
      this.diffuseColorUniform?.updateValue(material.diffuseColor.toArray())
      this.ambientColorUniform?.updateValue(material.ambientColor.toArray())
      this.specularColorUniform?.updateValue(material.specularColor.toArray())
      this.shininessUniform?.updateValue(material.shininess)
      this.wireframeUniform?.updateValue(material.wireframe)
      this.normalUniform?.updateValue(material.normal)

      if (material.wireframe) {
        context.drawMode = WebGL2RenderingContext.LINES
      } else {
        context.drawMode = WebGL2RenderingContext.TRIANGLES // TODO
      }
    } else {
      throw `invalid type: ${material}`
    }
  }
}