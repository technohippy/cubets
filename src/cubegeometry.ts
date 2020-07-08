import { Geometry } from "./geometry.js"

export class CubeGeometry extends Geometry {
  size: {x:number, y:number, z:number}

  constructor(size: {x:number, y:number, z:number}={x:1, y:1, z:1}) {
    super()
    this.size = size
    this.vertices = new Float32Array([
      +this.size.x/2, +this.size.y/2, +this.size.z/2, // 0
      +this.size.x/2, +this.size.y/2, -this.size.z/2, // 1
      +this.size.x/2, -this.size.y/2, +this.size.z/2, // 2
      +this.size.x/2, -this.size.y/2, -this.size.z/2, // 3

      -this.size.x/2, +this.size.y/2, +this.size.z/2, // 4
      -this.size.x/2, +this.size.y/2, -this.size.z/2, // 5
      -this.size.x/2, -this.size.y/2, +this.size.z/2, // 6
      -this.size.x/2, -this.size.y/2, -this.size.z/2, // 7

      +this.size.x/2, +this.size.y/2, +this.size.z/2, // 8
      -this.size.x/2, +this.size.y/2, +this.size.z/2, // 9
      +this.size.x/2, +this.size.y/2, -this.size.z/2, // 10
      -this.size.x/2, +this.size.y/2, -this.size.z/2, // 11

      +this.size.x/2, -this.size.y/2, +this.size.z/2, // 12
      -this.size.x/2, -this.size.y/2, +this.size.z/2, // 13
      +this.size.x/2, -this.size.y/2, -this.size.z/2, // 14
      -this.size.x/2, -this.size.y/2, -this.size.z/2, // 15

      +this.size.x/2, +this.size.y/2, +this.size.z/2, // 16
      +this.size.x/2, -this.size.y/2, +this.size.z/2, // 17
      -this.size.x/2, +this.size.y/2, +this.size.z/2, // 18
      -this.size.x/2, -this.size.y/2, +this.size.z/2, // 19

      +this.size.x/2, +this.size.y/2, -this.size.z/2, // 20
      +this.size.x/2, -this.size.y/2, -this.size.z/2, // 21
      -this.size.x/2, +this.size.y/2, -this.size.z/2, // 22
      -this.size.x/2, -this.size.y/2, -this.size.z/2, // 23
    ])
    this.indices = new Uint16Array([
      0,1,3,    0,3,2,    // +x
      4,5,7,    4,7,6,    // -x
      8,9,11,   8,11,10,  // +y
      12,13,15, 12,15,14, // -y
      16,17,19, 16,19,18, // +z
      20,21,23, 20,23,22, // -z
    ])
    this.normals = new Float32Array([
       1,0,0,  1,0,0,  1,0,0,  1,0,0,
      -1,0,0, -1,0,0, -1,0,0, -1,0,0,
       0,1,0,  0,1,0,  0,1,0,  0,1,0, 
      0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, 
       0,0,1,  0,0,1,  0,0,1,  0,0,1,
      0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
    ])
    this.uvs = new Float32Array([
      0,0, 0,1, 1,0, 1,1,
      0,0, 0,1, 1,0, 1,1,
      0,0, 0,1, 1,0, 1,1,
      0,0, 0,1, 1,0, 1,1,
      0,0, 0,1, 1,0, 1,1,
      0,0, 0,1, 1,0, 1,1,
    ])
  }
}