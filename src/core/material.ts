import { Renderer } from "./renderer.js";
import { Texture } from "./texture.js";
import { Mesh } from "./mesh.js";
import { Scene } from "./scene.js";

export abstract class Material {
  wireframe = false
  normal = false
  texture?: Texture

  abstract prepare(renderer:Renderer, mesh:Mesh): void;
  abstract setupGLVars(renderer:Renderer, mesh:Mesh): void;
}