import { GLContext } from "../../gl/glcontext.js";
import { Material } from "../material.js";
import { GLUniform } from "../../gl/gluniform.js";

export abstract class MaterialContext {
  wireframeUniform?:GLUniform
  normalUniform?:GLUniform

  textureUniform?:GLUniform
  skipTextureUniform?:GLUniform

  cubeTextureUniform?:GLUniform
  skipCubeTextureUniform?:GLUniform
  skyboxUniform?:GLUniform

  abstract upload(context:GLContext, material:Material):void
  abstract write(context:GLContext, material:Material):void
}