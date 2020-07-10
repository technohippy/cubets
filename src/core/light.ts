import { Renderer } from "./renderer";

export abstract class Light {
  abstract setupGLVars(renderer:Renderer): void
}