import { Geometry } from "../core2/geometry.js";
import { Material } from "../core2/material.js";
import { GLContext } from "../gl/glcontext.js";

export class Mesh {
  geometry:Geometry
  material?:Material

  constructor(geometry:Geometry, material?:Material) {
    this.geometry = geometry
    this.material = material
  }

  writeContext(context:GLContext) {
    this.geometry.writeContext(context)
    this.material?.writeContext(context)
  }
}