import { Geometry } from "../core/geometry.js";
import { Vec2 } from "../math/vec2.js"
import { Vec3 } from "../math/vec3.js"
import { Face3} from "../math/face3.js"

export class PlaneGeometry extends Geometry {
  x:number
  z:number
  constructor(x:number, z:number) {
    super()
    this.x = x
    this.z = z
    const x1 = this.x/2
    const x2 = -this.x/2
    const z1 = this.z/2
    const z2 = -this.z/2
    this.vertices = [
      new Vec3(x1, 0, z1),
      new Vec3(x2, 0, z1),
      new Vec3(x1, 0, z2),
      new Vec3(x2, 0, z2),
    ]
    this.indices = [
      new Face3(1,0,3),
      new Face3(3,0,2), 
    ]
    this.normals = [
      new Vec3(0, 1, 0),
      new Vec3(0, 1, 0),
      new Vec3(0, 1, 0),
      new Vec3(0, 1, 0),
    ]
    this.uvs = [
      new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1),
    ]
  }
}