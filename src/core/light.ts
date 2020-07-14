import { Renderer } from "./renderer";

export abstract class Light {
  abstract getGLVars(renderer:Renderer): {type:string, loc:WebGLUniformLocation, value:any}[];
}