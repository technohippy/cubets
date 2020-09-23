import { GLContext } from "../gl/glcontext.js";
import { ContextWriter } from "./contextwriter.js";
import { MaterialContext } from "./context/materialcontext.js";
import { GLUniform } from "../gl/gluniform.js";

export abstract class Material implements ContextWriter {
  wireframe = false
  normal = false

  abstract setupContext(config:{[key:string]:any}):MaterialContext
  abstract setupContextVars(config:{[key:string]:any}):void
  abstract writeContext(context:GLContext):void
}