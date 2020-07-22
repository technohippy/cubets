import { Transform3 } from "./transform3.js"

//@ts-ignore
import { glMatrix, quat, mat4 } from "../../node_modules/gl-matrix/esm/index.js"
import { Vec3 } from "./vec3.js"
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
    return this.fromEulerDegrees(x/Math.PI*180, y/Math.PI*180, z/Math.PI*180)
  }

  static fromEulerDegrees(x:number, y:number, z:number): Quat {
    const q = quat.fromEuler(quat.create(), x, y, z)
    return new Quat(...q)
  }

  toArray(): number[] {
    return [this.x, this.y, this.z, this.w]
  }

  toTransform(center:Vec3=new Vec3()): Transform3 {
    const move = Transform3.translate(center.clone().negate())
    const rotate = new Transform3(mat4.fromQuat(mat4.create(), this.toArray()))
    const remove = Transform3.translate(center.clone())
    return remove.multiply(rotate).multiply(move)
  }
}