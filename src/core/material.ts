import { Renderer } from "./renderer";

export abstract class Material {
  wireframe = false
  normal = false

  abstract setupGLVars(renderer:Renderer): void;
}