import { Geometry } from "../core/geometry.js";
import { Vec3 } from "../math/vec3.js";
import { Face3 } from "../math/face3.js";
import { Vec2 } from "../math/vec2.js";

export class SphereGeometry extends Geometry {
  radius: number
  constructor(radius:number) {
    super()
    this.radius = radius

    const numTheta = 10
    const numPhai = 16
    const dtheta = Math.PI / numTheta
    const dphai = 2 * Math.PI / numPhai
    this.vertices = [new Vec3(0, -radius, 0)]
    for (let thetaId = 1; thetaId < numTheta; thetaId++) {
      for (let phaiId = 0; phaiId < numPhai; phaiId++) {
        const theta = -Math.PI/2 + thetaId * dtheta
        const phai = phaiId * dphai
        const y = radius * Math.sin(theta)
        const radius2 = Math.sqrt(Math.pow(radius, 2) - Math.pow(Math.abs(y), 2))
        this.vertices.push(new Vec3(radius2 * Math.cos(phai), y, radius2 * Math.sin(phai)))
      }
    }
    this.vertices.push(new Vec3(0, radius, 0))

    this.indices = []
    // first line
    for (let id = 1; id < numPhai + 1; id++) {
      const prevId = id === 1 ? 1 + numPhai - 1 : id - 1 
      this.indices.push(new Face3(0, prevId, id))
    }
    // midile line
    for (let thetaId = 1; thetaId < numTheta - 1; thetaId++) {
      for (let phaiId = 0; phaiId < numPhai; phaiId++) {
        const id = 1 + (thetaId - 1) * numPhai + phaiId
        const prevId = phaiId === 0 ? id + numPhai - 1 : id - 1
        const upId = id + numPhai
        const prevUpId = prevId + numPhai
        this.indices.push(new Face3(id, prevUpId, upId))
        this.indices.push(new Face3(id, prevUpId, prevId))
      }
    }
    // last line
    const lastId = this.vertices.length - 1
    for (let id = lastId - 16 - 1; id <= lastId - 1; id++) {
      const prevId = id === lastId - 16 - 1 ? lastId - 1 : id - 1 
      this.indices.push(new Face3(id, lastId, prevId))
    }

    this.normals = Geometry.computeNormals(this.indices, this.vertices)

    this.uvs = new Array<Vec2>(this.indices.length).fill(new Vec2(0, 0))
  }
}