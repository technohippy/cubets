import { Scene } from "./scene";

export abstract class Material {
  wireframe = false

  abstract setupGLVars(gl:WebGL2RenderingContext, scene:Scene): void;
}