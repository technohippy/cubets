import { MaterialContext } from "./context/materialcontext.js";

export abstract class Material {
  wireframe = false
  normal = false

  abstract setupContext(config:{[key:string]:any}):MaterialContext
}