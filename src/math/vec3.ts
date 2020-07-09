//@ts-ignore
import { glMatrix, mat4, vec3 } from "../../node_modules/gl-matrix/esm/index.js"
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

  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z)
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

  add(vec: Vec3):Vec3 {
    this.x += vec.x
    this.y += vec.y
    this.z += vec.z
    return this
  }

  divide(val: number):Vec3 {
    this.x /= val
    this.y /= val
    this.z /= val
    return this
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  normalize():Vec3 {
    return this.divide(this.length())
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