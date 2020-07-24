import { Renderer } from "./renderer.js";
import { Texture } from "./texture.js";
import { Mesh } from "./mesh.js";

export abstract class Material {
  wireframe = false
  normal = false
  skipPrepare = false
  texture?: Texture
  normalTexture?: Texture

  abstract prepare(renderer:Renderer, mesh:Mesh): void;
  abstract setupGLVars(renderer:Renderer, mesh:Mesh): void;
}