import { Vec3 } from "./vec3.js"

//@ts-ignore
import { glMatrix, mat4, vec3 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class Transform3 {
  #mat: number[]

  constructor(mat:number[] = mat4.create()) {
    this.#mat = mat
  }

  clone(): Transform3 {
    return new Transform3(mat4.clone(this.#mat))
  }

  static translate(amount: Vec3): Transform3 {
    return new Transform3().translate(amount)
  }

  static rotate(rad: number, axis: Vec3): Transform3 {
    return new Transform3().rotate(rad, axis)
  }

  static scale(scales: Vec3): Transform3 {
    return new Transform3().scale(scales)
  }

  static scaleScalar(scale: number): Transform3 {
    return new Transform3().scaleScalar(scale)
  }

  translate(amount: Vec3): Transform3 {
    mat4.fromTranslation(this.#mat, amount.toArray())
    return this
  }

  rotate(rad: number, axis: Vec3): Transform3 {
    mat4.fromRotation(this.#mat, rad, axis.toArray())
    return this
  }

  scale(scales: Vec3): Transform3 {
    mat4.fromScaling(this.#mat, scales.toArray())
    return this
  }

  scaleScalar(scale: number): Transform3 {
    return this.scale(new Vec3(scale, scale, scale))
  }

  multiply(that: Transform3): Transform3 {
    mat4.mul(this.#mat, this.#mat, that.#mat)
    return this
  }

  apply(vec: Vec3) {
    vec.asArray(v => {
      return vec3.transformMat4(v, v, this.#mat)
    })
  }
}