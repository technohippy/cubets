import { GLContext } from "../gl/glcontext.js";
import { ContextWriter } from "./contextwriter.js";
import { MaterialContext } from "./context/materialcontext.js";

export abstract class Material implements ContextWriter {
  abstract setupContext(config:{[key:string]:any}):MaterialContext
  abstract setupContextVars(config:{[key:string]:any}):void
  abstract writeContext(context:GLContext):void
}