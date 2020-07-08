import { Geometry } from "./geometry.js"
import { Vec2 } from "./math/vec2.js"
import { Vec3 } from "./math/vec3.js"

export class CubeGeometry extends Geometry {
  size: {x:number, y:number, z:number}

  constructor(size: {x:number, y:number, z:number}={x:1, y:1, z:1}) {
    super()
    this.size = size
    this.vertices = [
      new Vec3(+this.size.x/2, +this.size.y/2, +this.size.z/2), // 0
      new Vec3(+this.size.x/2, +this.size.y/2, -this.size.z/2), // 1
      new Vec3(+this.size.x/2, -this.size.y/2, +this.size.z/2), // 2
      new Vec3(+this.size.x/2, -this.size.y/2, -this.size.z/2), // 3

      new Vec3(-this.size.x/2, +this.size.y/2, +this.size.z/2), // 4
      new Vec3(-this.size.x/2, +this.size.y/2, -this.size.z/2), // 5
      new Vec3(-this.size.x/2, -this.size.y/2, +this.size.z/2), // 6
      new Vec3(-this.size.x/2, -this.size.y/2, -this.size.z/2), // 7

      new Vec3(+this.size.x/2, +this.size.y/2, +this.size.z/2), // 8
      new Vec3(-this.size.x/2, +this.size.y/2, +this.size.z/2), // 9
      new Vec3(+this.size.x/2, +this.size.y/2, -this.size.z/2), // 10
      new Vec3(-this.size.x/2, +this.size.y/2, -this.size.z/2), // 11

      new Vec3(+this.size.x/2, -this.size.y/2, +this.size.z/2), // 12
      new Vec3(-this.size.x/2, -this.size.y/2, +this.size.z/2), // 13
      new Vec3(+this.size.x/2, -this.size.y/2, -this.size.z/2), // 14
      new Vec3(-this.size.x/2, -this.size.y/2, -this.size.z/2), // 15

      new Vec3(+this.size.x/2, +this.size.y/2, +this.size.z/2), // 16
      new Vec3(+this.size.x/2, -this.size.y/2, +this.size.z/2), // 17
      new Vec3(-this.size.x/2, +this.size.y/2, +this.size.z/2), // 18
      new Vec3(-this.size.x/2, -this.size.y/2, +this.size.z/2), // 19

      new Vec3(+this.size.x/2, +this.size.y/2, -this.size.z/2), // 20
      new Vec3(+this.size.x/2, -this.size.y/2, -this.size.z/2), // 21
      new Vec3(-this.size.x/2, +this.size.y/2, -this.size.z/2), // 22
      new Vec3(-this.size.x/2, -this.size.y/2, -this.size.z/2), // 23
    ]
    this.indices = [
      0,1,3,    0,3,2,    // +x
      4,5,7,    4,7,6,    // -x
      8,9,11,   8,11,10,  // +y
      12,13,15, 12,15,14, // -y
      16,17,19, 16,19,18, // +z
      20,21,23, 20,23,22, // -z
    ]
    this.normals = [
      new Vec3( 1,0,0), new Vec3( 1,0,0), new Vec3( 1,0,0), new Vec3( 1,0,0),
      new Vec3(-1,0,0), new Vec3(-1,0,0), new Vec3(-1,0,0), new Vec3(-1,0,0),
      new Vec3( 0,1,0), new Vec3( 0,1,0), new Vec3( 0,1,0), new Vec3( 0,1,0), 
      new Vec3(0,-1,0), new Vec3(0,-1,0), new Vec3(0,-1,0), new Vec3(0,-1,0), 
      new Vec3( 0,0,1), new Vec3( 0,0,1), new Vec3( 0,0,1), new Vec3( 0,0,1),
      new Vec3(0,0,-1), new Vec3(0,0,-1), new Vec3(0,0,-1), new Vec3(0,0,-1),
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