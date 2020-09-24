import { Light } from "./light.js";
import { GLUniform } from "../gl/gluniform.js";
import { Vec3 } from "../math/vec3.js";
import { RGBAColor } from "../math/rgbacolor.js";
import { LightContext } from "./context/lightcontext.js";
import { PhongLightContext } from "./phonglightcontext.js";

export abstract class PhongLight extends Light {
  shouldFollowCamera = false

  direction = new Vec3()

  diffuseColor:RGBAColor
  ambientColor:RGBAColor
  specularColor:RGBAColor

  constructor(diffuse:RGBAColor, ambient:RGBAColor, specular:RGBAColor=RGBAColor.Gray) {
    super()
    this.diffuseColor = diffuse
    this.ambientColor = ambient
    this.specularColor = specular
  }

  setupContext(config:{[key:string]:GLUniform}):LightContext {
    return new PhongLightContext(config)
  }
}