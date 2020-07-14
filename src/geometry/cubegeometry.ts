import { Geometry } from "../core/geometry.js"
import { Vec2 } from "../math/vec2.js"
import { Vec3 } from "../math/vec3.js"
import { Face3} from "../math/face3.js"

export class CubeGeometry extends Geometry {
  x:number
  y:number
  z:number

  constructor(x:number=1, y:number=1, z:number=1) {
    super()
    this.x = x
    this.y = y
    this.z = z
    const x1 = this.x/2
    const x2 = -this.x/2
    const y1 = this.y/2
    const y2 = -this.y/2
    const z1 = this.z/2
    const z2 = -this.z/2
    this.vertices = [
      new Vec3(x1, y1, z1), // 0
      new Vec3(x1, y1, z2), // 1
      new Vec3(x1, y2, z1), // 2
      new Vec3(x1, y2, z2), // 3

      new Vec3(x2, y1, z1), // 4
      new Vec3(x2, y1, z2), // 5
      new Vec3(x2, y2, z1), // 6
      new Vec3(x2, y2, z2), // 7

      new Vec3(x1, y1, z1), // 8
      new Vec3(x2, y1, z1), // 9
      new Vec3(x1, y1, z2), // 10
      new Vec3(x2, y1, z2), // 11

      new Vec3(x1, y2, z1), // 12
      new Vec3(x2, y2, z1), // 13
      new Vec3(x1, y2, z2), // 14
      new Vec3(x2, y2, z2), // 15

      new Vec3(x1, y1, z1), // 16
      new Vec3(x1, y2, z1), // 17
      new Vec3(x2, y1, z1), // 18
      new Vec3(x2, y2, z1), // 19

      new Vec3(x1, y1, z2), // 20
      new Vec3(x1, y2, z2), // 21
      new Vec3(x2, y1, z2), // 22
      new Vec3(x2, y2, z2), // 23
    ]
    this.indices = [
      new Face3(1,0,3),    new Face3(3,0,2),    // +x
      new Face3(4,5,7),    new Face3(4,7,6),    // -x
      new Face3(9,8,11),   new Face3(11,8,10),  // +y
      new Face3(12,13,15), new Face3(12,15,14), // -y
      new Face3(17,16,19), new Face3(19,16,18), // +z
      new Face3(20,21,23), new Face3(20,23,22), // -z
    ]
    this.normals = Geometry.computeNormals(this.indices, this.vertices)
    this.uvs = [
      new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1),
      new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1),
      new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1),
      new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1),
      new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1),
      new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1),
    ]
    this.uvs = [
      new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1),
      new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1),
      new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1),
      new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1),
      new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1),
      new Vec2(0,0), new Vec2(0,1), new Vec2(1,0), new Vec2(1,1),
    ]
  }
}