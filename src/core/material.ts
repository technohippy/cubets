import { Renderer } from "./renderer.js";
import { Texture } from "./texture.js";

export abstract class Material {
  wireframe = false
  normal = false
  texture?: Texture

  abstract setupGLVars(renderer:Renderer): void;
}