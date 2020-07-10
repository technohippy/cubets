import { Renderer } from "./renderer";

export abstract class Material {
  wireframe = false

  abstract setupGLVars(renderer:Renderer): void;
}