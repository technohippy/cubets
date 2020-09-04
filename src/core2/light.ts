import { ContextWriter } from "./contextwriter.js";
import { GLContext } from "../gl/glcontext.js";
import { GLUniform } from "../gl/gluniform.js";

export abstract class Light implements ContextWriter {
  shouldFollowCamera = false

  abstract setupContextVars(config:{[key:string]:GLUniform}):void
  abstract writeContext(context:GLContext):void
}