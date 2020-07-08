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
    return new Float32Array(this.geometry.vertices.map(v => v.toArray()).flat())
  }

  getNormals(): Float32Array {
    return new Float32Array(this.geometry.normals.map(v => v.toArray()).flat())
  }

  getIndices(): Uint16Array {
    return new Uint16Array(this.geometry.indices)
  }
}