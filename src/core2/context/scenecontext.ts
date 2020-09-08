import { GLContext } from "../../gl/glcontext.js";
import { GLProgram } from "../../gl/glprogram.js";
import { LightContext } from "./lightcontext.js";
import { GeometryContext } from "./geometrycontext.js";
import { MaterialContext } from "./materialcontext.js";
import { CameraContext } from "./cameracontext.js";

export class SceneContext {
  program?:GLProgram
  context:GLContext

  geometries:WeakMap<any, GeometryContext> = new WeakMap()
  materials:WeakMap<any, MaterialContext> = new WeakMap()
  lights:WeakMap<any, LightContext> = new WeakMap()
  camera?:CameraContext

  constructor(...flags:number[]) {
    if (flags.length === 0) {
      flags = [
        WebGL2RenderingContext.CULL_FACE,
        WebGL2RenderingContext.DEPTH_TEST,
      ]
    }
    this.context = new GLContext(...flags)
  }
}