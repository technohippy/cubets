import { Geometry } from "../core/geometry.js";
import { Vec2 } from "../math/vec2.js";
import { Vec3 } from "../math/vec3.js";
import { Face3 } from "../math/face3.js";

export class CylinderGeometry extends Geometry {
  radius: number
  height: number

  constructor(radius:number, height:number) {
    super()
    this.radius = radius
    this.height = height
    const numPhi = 16
    const dPhi = 2 * Math.PI / numPhi
    this.vertices = [new Vec3(0, -this.height / 2, 0)];
    [-this.height / 2, -this.height / 2, this.height / 2, this.height / 2].forEach(y => {
      for (let phiId = 0; phiId < numPhi; phiId++) {
        const phi = phiId * dPhi
        this.vertices.push(new Vec3(this.radius * Math.cos(phi), y, this.radius * Math.sin(phi)))
      }
    })
    this.vertices.push(new Vec3(0, this.height / 2, 0))

    this.indices = []
    // bottom
    for (let id = 1; id <= numPhi; id++) {
      const prevId = id === 1 ? id + numPhi - 1 : id - 1
      this.indices.push(new Face3(0, prevId, id))
    }
    // top
    for (let id = 1+3*numPhi; id <= 4*numPhi; id++) {
      const prevId = id === 1+3*numPhi ? id + numPhi - 1 : id - 1
      this.indices.push(new Face3(4*numPhi+1, id, prevId))
    }
    // side
    for (let bottomId = 1+numPhi; bottomId <= 2*numPhi; bottomId++) {
      const prevBottomId = bottomId === 1+numPhi ? bottomId + numPhi - 1 : bottomId - 1
      const topId = bottomId + numPhi
      const prevTopId = prevBottomId + numPhi
      this.indices.push(new Face3(bottomId, prevTopId, topId))
      this.indices.push(new Face3(bottomId, prevBottomId, prevTopId))
    }

    this.normals = Geometry.computeNormals(this.indices, this.vertices)

    // 仮
    this.uvs = new Array<Vec2>(this.indices.length).fill(new Vec2(0, 0))
  }
}