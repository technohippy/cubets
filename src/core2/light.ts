import { ContextWriter } from "./contextwriter.js";
import { GLContext } from "../gl/glcontext.js";
import { GLUniform } from "../gl/gluniform.js";
import { LightContext } from "./context/lightcontext.js";

export abstract class Light implements ContextWriter {
  abstract setupContext(config:{[key:string]:GLUniform}):LightContext
  abstract setupContextVars(config:{[key:string]:GLUniform}):void
  abstract writeContext(context:GLContext):void
}