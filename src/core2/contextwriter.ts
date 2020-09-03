import { GLContext } from "../gl/glcontext.js"
import { GLAttribute } from "../gl/glattribute.js";
import { GLUniform } from "../gl/gluniform.js";

export interface ContextWriter {
  setupContextVars(config:{[key:string]:(GLAttribute|GLUniform)}, config2?:{[key:string]:(GLAttribute|GLUniform)}):void
  writeContext(context:GLContext):void
}