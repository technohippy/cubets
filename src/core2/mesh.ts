import { Geometry, GeometryConfig } from "./geometry.js";
import { Material } from "./material.js";
import { Vec3 } from "../math/vec3.js";
import { Quat } from "../math/quat.js";
import { Transform3 } from "../math/transform3.js";

export class Mesh {
  geometry:Geometry
  material?:Material

  position = new Vec3()
  rotation = new Quat()
  transforms: Transform3[] = []
  basePosition = new Vec3() // center of rotation

  localPosition = new Vec3() // relative position from the parent mesh
  parent?: Mesh
  children: Mesh[] = []

  constructor(geometry:Geometry, material?:Material) {
    this.geometry = geometry
    this.material = material
  }

  translate(amount: Vec3) {
    this.transforms.push(Transform3.translate(amount))
  }

  rotate(rad: number, axis: Vec3) {
    this.transforms.push(Transform3.rotate(rad, axis))
  }

  scale(scale: number) {
    this.transforms.push(Transform3.scaleScalar(scale))
  }

  resetTransform() {
    this.transforms.length = 0
  }

  private getTransform(): Transform3 {
    const parentTransform = this.parent ? this.parent.getTransform() : new Transform3()
    const localPositionTransform = Transform3.translate(this.localPosition)
    const basePositionTransform = Transform3.translate(this.basePosition.clone().negate())
    const positionTransform = Transform3.translate(this.position)
    const rotationTransform = this.rotation.toTransform()

    const transform = parentTransform
    transform.multiply(localPositionTransform)
    for (let i = this.transforms.length - 1; 0 <= i; i--) {
      transform.multiply(this.transforms[i])
    }
    transform.multiply(positionTransform)
    transform.multiply(rotationTransform)
    transform.multiply(basePositionTransform)

    return transform
  }

  applyTransform() {
    this.geometry.transform = this.getTransform()
  }
}