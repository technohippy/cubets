import { MaterialContext } from "./context/materialcontext.js";
import { Texture } from "./texture.js";

export abstract class Material {
  wireframe = false
  normal = false
  texture?:Texture

  abstract setupContext(config:{[key:string]:any}):MaterialContext
}