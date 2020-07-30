import { PolarCoord } from "./polarcoord.js"

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

  copy(v:Vec3): Vec3 {
    this.x = v.x
    this.y = v.y
    this.z = v.z
    return this
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

  cross(vec:Vec3):Vec3 {
    return new Vec3(...vec3.cross(vec3.create(), this.toArray(), vec.toArray()))
  }

  add(vec: Vec3):Vec3 {
    this.x += vec.x
    this.y += vec.y
    this.z += vec.z
    return this
  }
  
  subtract(vec: Vec3):Vec3 {
    this.x -= vec.x
    this.y -= vec.y
    this.z -= vec.z
    return this
  }

  multiplyScalar(val: number):Vec3 {
    this.x *= val
    this.y *= val
    this.z *= val
    return this
  }

  divideScalar(val: number):Vec3 {
    this.x /= val
    this.y /= val
    this.z /= val
    return this
  }

  negate():Vec3 {
    this.x *= -1
    this.y *= -1
    this.z *= -1
    return this
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  distance(that:Vec3): number {
    return this.clone().subtract(that).length()
  }

  normalize():Vec3 {
    return this.divideScalar(this.length())
  }

  angleTo(v:Vec3):number {
    return vec3.angle(this.toArray(), v.toArray())
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

  toPolar(): PolarCoord {
    const r = this.length()
    const theta = Math.acos(this.y/r)
    const phai = Math.atan(this.z/(this.x + 0.00001))
    return new PolarCoord(r, theta, phai)
  }

  fromPolar(polar: PolarCoord): Vec3 {
    return this.copy(polar.toVec3())
  }
}