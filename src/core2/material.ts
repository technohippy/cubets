import { GLContext } from "../gl/glcontext.js";
import { ContextWriter } from "./contextwriter.js";

export abstract class Material implements ContextWriter {
  abstract setupContextVars(config:{[key:string]:any}):void
  abstract writeContext(context:GLContext):void
}