import { MaterialContext } from "./context/materialcontext.js";
import { PhongMaterialConfig, PhongMaterial } from "./phongmaterial.js";
import { GLUniform } from "../gl/gluniform.js";
import { GLContext } from "../gl/glcontext.js";
import { Material } from "./material.js";
import { GLTexture2D } from "../gl/gltexture2d.js";
import { Texture } from "./texture.js";

export class PhongMaterialContext extends MaterialContext {
  diffuseColorUniform?:GLUniform
  ambientColorUniform?:GLUniform
  specularColorUniform?:GLUniform
  shininessUniform?:GLUniform

  texture2Ds:WeakMap<Texture, GLTexture2D> = new WeakMap() 

  constructor(config:PhongMaterialConfig) {
    super()
    this.diffuseColorUniform = config["diffuse"]
    this.ambientColorUniform = config["ambient"]
    this.specularColorUniform = config["specular"]
    this.shininessUniform = config["shininess"]

    this.wireframeUniform = config["wireframe"]
    this.normalUniform = config["normal"]
    this.textureUniform = config["texture"]
    this.skipTextureUniform = config["skipTexture"]
  }

  upload(context:GLContext, material:Material) {
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
    if (this.textureUniform && material?.texture?.image) {
      if (!this.texture2Ds.has(material.texture)) {
        this.texture2Ds.set(
          material.texture,
          new GLTexture2D(WebGL2RenderingContext.TEXTURE_2D, material.texture.image, {
            minFilter:WebGL2RenderingContext.NEAREST,
            magFilter:WebGL2RenderingContext.NEAREST,
          })
        )
      }
      const texture = this.texture2Ds.get(material.texture)
      this.textureUniform?.updateValue(texture!)
      context.addUniform(this.textureUniform)
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

      if (this.textureUniform && material?.texture?.image) {
        const texture = this.texture2Ds.get(material.texture)
        if (texture) {
          this.textureUniform.updateValue(texture)
        }
      }

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