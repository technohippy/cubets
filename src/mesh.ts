import { Geometry } from "./geometry.js";
import { Material } from "./material.js";

export class Mesh {
  geometry: Geometry
  material: Material

  constructor(geometry: Geometry, material: Material) {
    this.geometry = geometry
    this.material = material
  }

  getVertices(): Float32Array {
    return this.geometry.vertices
  }

  getNormals(): Float32Array {
    return this.geometry.normals
  }

  getIndices(): Uint16Array {
    return this.geometry.indices
  }
}