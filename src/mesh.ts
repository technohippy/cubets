import { Geometry } from "./geometry.js";
import { Material } from "./material.js";
import { Transform3 } from "./math/transform3.js"
import { Vec3 } from "./math/vec3.js"
import { mat4 } from "gl-matrix";

export class Mesh {
  geometry: Geometry
  material: Material

  transforms: Transform3[] = []

  constructor(geometry: Geometry, material: Material) {
    this.geometry = geometry
    this.material = material
  }

  translate(amount: Vec3) {
    this.transforms.push(Transform3.translate(amount))
  }

  rotate(rad: number, axis: Vec3) {
    this.transforms.push(Transform3.rotate(rad, axis))
  }

  getVertices(): Float32Array {
    this._concentrateMatrixes()
    return new Float32Array(this.geometry.vertices.map(v => {
      const vv = v.clone()
      this.transforms.forEach(t => t.apply(vv))
      return vv.toArray()
    }).flat())
  }

  getNormals(): Float32Array {
    this._concentrateMatrixes()
    return new Float32Array(this.geometry.normals.map(v => {
      const vv = v.clone()
      this.transforms.forEach(t => t.apply(vv))
      return vv.toArray()
    }).flat())
  }

  getIndices(): Uint16Array {
    return new Uint16Array(this.geometry.indices)
  }

  private _concentrateMatrixes() {
    const concentration = this.transforms.pop()
    if (concentration) {
      this.transforms.reverse().forEach(t => concentration?.multiply(t))
      this.transforms.length = 0
      this.transforms.push(concentration!)
    }
  }
}