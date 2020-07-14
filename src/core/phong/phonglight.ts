import { Light } from "../light.js";
import { Vec3 } from "../../math/vec3.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";

export abstract class PhongLight extends Light {
  shouldFollowCamera = false

  ambientColor: RGBAColor
  diffuseColor: RGBAColor
  specularColor: RGBAColor

  constructor(ambientColor:RGBAColor, diffuseColor:RGBAColor, specularColor:RGBAColor=RGBAColor.Gray) {
    super()
    this.ambientColor = ambientColor
    this.diffuseColor = diffuseColor
    this.specularColor = specularColor
  }

  getGLVars(renderer:Renderer): {type:string, loc:WebGLUniformLocation, value:any}[] {
    const ret:{type:string, loc:WebGLUniformLocation, value:any}[] = []
    const gl = renderer.gl
    const lightFollowCameraModeLocation = renderer.getUniformLocation("uLightFollowCameraMode")
    const lightAmbientLocation = renderer.getUniformLocation("uLightAmbient")
    const lightDiffuseLocation = renderer.getUniformLocation("uLightDiffuse")
    const lightSpecularLocation = renderer.getUniformLocation("uLightSpecular")
    ret.push({type:"1i", loc:lightFollowCameraModeLocation, value:this.shouldFollowCamera ? 1 : 0})
    ret.push({type:"4f", loc:lightAmbientLocation, value:this.ambientColor.toArray()})
    ret.push({type:"4f", loc:lightDiffuseLocation, value:this.diffuseColor.toArray()})
    ret.push({type:"4f", loc:lightSpecularLocation, value:this.specularColor.toArray()})
    return ret
  }
}