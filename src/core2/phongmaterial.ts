import { Material } from "./material.js";
import { RGBAColor } from "../math/rgbacolor.js";
import { GLUniform } from "../gl/gluniform.js";
import { PhongMaterialContext } from "./phongmaterialcontext.js";
import { MaterialContext } from "./context/materialcontext.js";

type PhongMaterialConfigKey = "diffuse" | "ambient" | "specular" | "shininess" | "wireframe" | "normal" | "texture" | "skipTexture"
export type PhongMaterialConfig = {[key in PhongMaterialConfigKey]?:GLUniform}

export class PhongMaterial extends Material {
  diffuseColor: RGBAColor
  ambientColor: RGBAColor
  specularColor: RGBAColor
  shininess: number
  pointSize?: number // only for particles

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
}