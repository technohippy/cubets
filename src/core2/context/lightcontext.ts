import { GLContext } from "../../gl/glcontext.js";
import { Light } from "../light.js";

export abstract class LightContext {
  abstract upload(context:GLContext):void
  abstract write(light:Light, position:number):void
}