import { Vec3 } from "./vec3.js"

//@ts-ignore
import { glMatrix, mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } from "../../node_modules/gl-matrix/esm/index.js"

export class Transform3 {
  #mat: number[] = mat4.create()

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

  apply(vec: Vec3) {
    vec.asArray(v => {
      return vec3.transformMat4(v, v, this.#mat)
    })
  }
}