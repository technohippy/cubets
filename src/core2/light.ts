import { GLUniform } from "../gl/gluniform.js";
import { LightContext } from "./context/lightcontext.js";

export abstract class Light {
  abstract setupContext(config:{[key:string]:GLUniform}):LightContext
}