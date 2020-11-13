import { MaterialContext } from "./context/materialcontext.js";
import { PhongMaterialConfig, PhongMaterial } from "./phongmaterial.js";
import { GLUniform } from "../gl/gluniform.js";
import { GLContext } from "../gl/glcontext.js";
import { Material } from "./material.js";
import { GLTexture2D } from "../gl/gltexture2d.js";
import { Texture } from "./texture.js";
import { GLTextureCube } from "../gl/gltexturecube.js";
import { CubeTexture } from "./cubetexture.js";
import { GLImage } from "../gl/glimage.js";

export class PhongMaterialContext extends MaterialContext {
  diffuseColorUniform?:GLUniform
  ambientColorUniform?:GLUniform
  specularColorUniform?:GLUniform
  shininessUniform?:GLUniform

  texture2Ds:WeakMap<Texture, GLTexture2D> = new WeakMap() 
  textureCubes:WeakMap<CubeTexture, GLTextureCube> = new WeakMap() 

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
    this.cubeTextureUniform = config["cubeTexture"]
    this.skipCubeTextureUniform = config["skipCubeTexture"]
    this.skyboxUniform = config["skybox"]
  }

  upload(context:GLContext, material:Material) {
    if (this.diffuseColorUniform) {
      this.diffuseColorUniform.updateValue([1, 1, 1, 1]) // TODO: default
      context.addUniform(this.diffuseColorUniform)
    }

    if (this.ambientColorUniform) {
      this.ambientColorUniform.updateValue([1, 1, 1, 1]) // TODO: default
      context.addUniform(this.ambientColorUniform)
    }

    if (this.specularColorUniform) {
      this.specularColorUniform.updateValue([1, 1, 1, 1]) // TODO: default
      context.addUniform(this.specularColorUniform)
    }
    if (this.shininessUniform) {
      this.shininessUniform.updateValue(0) // TODO: default
      context.addUniform(this.shininessUniform)
    }

    if (this.wireframeUniform) {
      this.wireframeUniform.updateValue(0) // TODO: default
      context.addUniform(this.wireframeUniform)
    }

    if (this.normalUniform) {
      this.normalUniform.updateValue(0) // TODO: default
      context.addUniform(this.normalUniform)
    }

    let skipTexture = true
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
      skipTexture = false
    }
    if (this.skipTextureUniform) {
      this.skipTextureUniform.updateValue(skipTexture)
      context.addUniform(this.skipTextureUniform)
    }

    let skipCubeTexture = true
    if (this.cubeTextureUniform && material?.cubeTexture?.images) {
      if (!this.textureCubes.has(material.cubeTexture)) {
        const images = material.cubeTexture.images
          .filter(image => typeof image !== "string")
          .map(image => {
            if (typeof image !== "string") {
              if (image instanceof Function) {
                return image
              } else {
                return new GLImage(image)
              }
            } else {
              throw "never reach"
            }
          })
        this.textureCubes.set(
          material.cubeTexture,
          new GLTextureCube(WebGL2RenderingContext.TEXTURE_CUBE_MAP, images, {
            magFilter:WebGL2RenderingContext.LINEAR,
            minFilter:WebGL2RenderingContext.LINEAR,
          })
        )
      }
      const cubeTexture = this.textureCubes.get(material.cubeTexture)
      this.cubeTextureUniform?.updateValue(cubeTexture!)
      context.addUniform(this.cubeTextureUniform)
      skipCubeTexture = true
    }
    if (this.skipCubeTextureUniform) {
      this.skipCubeTextureUniform.updateValue(skipCubeTexture)
      context.addUniform(this.skipCubeTextureUniform)
    }

    if (this.skyboxUniform) {
      this.skyboxUniform.updateValue(false) // TODO: default
      context.addUniform(this.skyboxUniform)
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

      let skipCubeTexture = true
      if (this.cubeTextureUniform && material?.cubeTexture?.images) {
        const cubeTexture = this.textureCubes.get(material.cubeTexture)
        if (cubeTexture) {
          this.cubeTextureUniform.updateValue(cubeTexture)
          skipCubeTexture = false
        }
      }
      this.skipCubeTextureUniform?.updateValue(skipCubeTexture)

      this.skyboxUniform?.updateValue(!!material.cubeTexture?.isSkybox)

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