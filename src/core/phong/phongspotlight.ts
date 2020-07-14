import { PhongLight } from "./phonglight.js";
import { Vec3 } from "../../math/vec3.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";

export class PhongSpotLight extends PhongLight {
  position: Vec3
  direction: Vec3
  cutoff = 20

  constructor(position:Vec3, direction:Vec3, ambientColor:RGBAColor, diffuseColor:RGBAColor, specularColor:RGBAColor=RGBAColor.Gray) {
    super(ambientColor, diffuseColor, specularColor)
    this.position = position
    this.direction = direction
  }

  getGLVars(renderer:Renderer): {type:string, loc:WebGLUniformLocation, value:any}[] {
    const ret = super.getGLVars(renderer)
    const gl = renderer.gl
    const cutoffLocation = renderer.getUniformLocation("uCutoff")
    const positionalLightLocation = renderer.getUniformLocation("uPositionalLight")
    const lightPositionLocation = renderer.getUniformLocation("uLightPosition")
    const lightDirectionLocation = renderer.getUniformLocation("uLightDirection")
    ret.push({type:"1f", loc:cutoffLocation, value:this.cutoff})
    ret.push({type:"1i", loc:positionalLightLocation, value:1})
    ret.push({type:"3f", loc:lightPositionLocation, value:this.position.toArray()})
    ret.push({type:"3f", loc:lightDirectionLocation, value:this.direction.toArray()})
    return ret
  }
}