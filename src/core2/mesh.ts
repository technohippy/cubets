import { Geometry, GeometryConfig } from "./geometry.js";
import { Material } from "./material.js";
import { ContextWriter } from "./contextwriter.js";
import { GLContext } from "../gl/glcontext.js";

export class Mesh implements ContextWriter {
  geometry:Geometry
  material?:Material

  constructor(geometry:Geometry, material?:Material) {
    this.geometry = geometry
    this.material = material
  }

  setupContextVars(geometryConfig:GeometryConfig, materialConfig:{[key:string]:any}) {
    this.geometry.setupContextVars(geometryConfig)
    this.material?.setupContextVars(materialConfig)
  }

  writeContext(context:GLContext) {
    this.geometry.writeContext(context)
    this.material?.writeContext(context)
  }
}