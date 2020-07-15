import { Geometry } from "../core/geometry.js";
import { Vec3 } from "../math/vec3.js";
import { Face3 } from "../math/face3.js";
import { Vec2 } from "../math/vec2.js";

export class GroundGeometry extends Geometry {
  x:number
  z:number
  numX:number
  numZ:number

  constructor(x:number=1, z:number=1, numX:number=1, numZ:number=1) {
    super()
    this.x = x
    this.z = z
    this.numX = numX
    this.numZ = numZ
    const maxX = this.x/2
    const minX = -this.x/2
    const maxZ = this.z/2
    const minZ = -this.z/2
    const dx = this.x / this.numX
    const dz = this.z / this.numZ
    this.vertices = []
    for (let zi = 0; zi < numZ; zi++) {
      for (let xi = 0; xi < numX; xi++) {
        this.vertices.push(new Vec3(minX + dx * xi, 0, minZ + dz * zi))
      }
    }
    this.indices = []
    for (let zi = 0; zi < numZ - 1; zi++) {
      for (let xi = 0; xi < numX - 1; xi++) {
        const i = zi * numX + xi
        this.indices.push(new Face3(i, i+numX, i+numX+1))
        this.indices.push(new Face3(i, i+numX+1, i+1))
      }
    }
    this.normals = Geometry.computeNormals(this.indices, this.vertices)
    this.uvs = this.vertices.map(v => new Vec2(v.x/this.x, v.z/this.z))
  }
}