import { PhongLight } from "./phonglight.js";
import { Vec3 } from "../../math/vec3.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";

export class PhongPositionalLight extends PhongLight {
  position: Vec3

  constructor(position:Vec3, ambientColor:RGBAColor, diffuseColor:RGBAColor, specularColor:RGBAColor=RGBAColor.Gray) {
    super(ambientColor, diffuseColor, specularColor)
    this.position = position
  }

  getGLVars(renderer:Renderer): {type:string, loc:WebGLUniformLocation, value:any}[] {
    const ret = super.getGLVars(renderer)
    const gl = renderer.gl
    const positionalLightLocation = renderer.getUniformLocation("uPositionalLight")
    const lightPositionLocation = renderer.getUniformLocation("uLightPosition")
    const lightDirectionLocation = renderer.getUniformLocation("uLightDirection")
    ret.push({type:"1i", loc:positionalLightLocation, value:1})
    ret.push({type:"3f", loc:lightPositionLocation, value:this.position.toArray()})
    ret.push({type:"3f", loc:lightDirectionLocation, value:[0, 0, 0]})
    return ret
  }
}