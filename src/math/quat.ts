import { Transform3 } from "./transform3.js"

//@ts-ignore
import { glMatrix, quat, mat4 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class Quat {
  x: number
  y: number
  z: number
  w: number

  constructor(x:number=0, y:number=0, z:number=0, w:number=1) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  static fromEuler(x:number, y:number, z:number): Quat {
    const q = quat.fromEuler(quat.create(), x, y, z)
    return new Quat(...q)
  }

  toArray(): number[] {
    return [this.x, this.y, this.z, this.w]
  }

  toTransform(): Transform3 {
    const mat = mat4.fromQuat(mat4.create(), this.toArray())
    return new Transform3(mat)
  }
}