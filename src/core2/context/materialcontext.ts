import { GLContext } from "../../gl/glcontext.js";
import { Material } from "../material.js";

export abstract class MaterialContext {
  abstract upload(context:GLContext):void
  abstract write(material:Material):void
}