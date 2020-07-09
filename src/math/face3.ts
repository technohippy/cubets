import { Vec3 } from "./vec3.js"

//@ts-ignore
import { glMatrix, vec3 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class Face3 {
  p1: number
  p2: number
  p3: number

  constructor(p1: number, p2: number, p3: number) {
    this.p1 = p1
    this.p2 = p2
    this.p3 = p3
  }

  normal(vertices: Vec3[]): Vec3 {
    const v1 = vertices[this.p1].toArray()
    const v2 = vertices[this.p2].toArray()
    const v3 = vertices[this.p3].toArray()
    const v12 = vec3.subtract(v2, v1, v2)
    const v13 = vec3.subtract(v3, v1, v3)
    const norm = vec3.cross(vec3.create(), v12, v13)
    return new Vec3(...norm)
  }

  toArray(): number[] {
    return [this.p1, this.p2, this.p3]
  }
}