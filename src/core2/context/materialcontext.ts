import { GLContext } from "../../gl/glcontext.js";
import { Material } from "../material.js";
import { GLUniform } from "../../gl/gluniform.js";

export abstract class MaterialContext {
  wireframeUniform?:GLUniform
  normalUniform?:GLUniform
  textureUniform?:GLUniform
  skipTextureUniform?:GLUniform

  /*
  constructor(config:{[key:string]:GLUniform}) {
    this.wireframeUniform = config["wireframe"]
    this.normalUniform = config["normal"]
    this.textureUniform = config["texture"]
    this.skipTextureUniform = config["skipTexture"]
  }
  */

  abstract upload(context:GLContext, material:Material):void
  abstract write(context:GLContext, material:Material):void
}