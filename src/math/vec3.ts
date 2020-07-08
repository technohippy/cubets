//@ts-ignore
import { glMatrix, mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } from "../../node_modules/gl-matrix/esm/index.js"

glMatrix.setMatrixArrayType(Array)

export class Vec3 {
  x:number
  y:number
  z:number

  constructor(x:number=0, y:number=0, z:number=0) {
    this.x = x
    this.y = y
    this.z = z
  }
 
  translate(amount:Vec3) {
    this.asArray((vals:number[]):number[] => {
      return vec3.add(vals, vals, amount)
    })
  }

  rotate(rad:number, axis:Vec3) {
    this.asArray((vals:number[]):number[] => {
      const rotMat = mat4.fromRotation(mat4.create(), rad, axis.toArray())
      return vec3.transformMat4(vec3.create(), vals, rotMat)
    })
  }

  toArray(): number[] {
    return [this.x, this.y, this.z]
  }

  fromArray(values:number[]) {
    [this.x, this.y, this.z] = values
  }

  asArray(fn:(vals:number[]) => number[]) {
    this.fromArray(fn(this.toArray()))
  }
}