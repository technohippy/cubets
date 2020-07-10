import { Scene } from "./scene";

export abstract class Light {
  abstract setupGLVars(gl:WebGL2RenderingContext, scene:Scene): void
}