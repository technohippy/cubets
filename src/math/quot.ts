//@ts-ignore
import { glMatrix, vec3 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class Quot {
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
}