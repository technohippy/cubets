import { Vec2 } from '../math/vec2.js'
import { Vec3 } from '../math/vec3.js'
import { Face3 } from '../math/face3.js'

export abstract class Geometry {
  vertices:Vec3[] = []
  indices:Face3[] = []
  normals:Vec3[] = []
  uvs:Vec2[] = []

  static computeNormals(indices:Face3[], vertices:Vec3[]) {
    const normals:Vec3[][] = []
    indices.forEach(index => {
      const normal = index.normal(vertices)
      index.toArray().forEach(i => {
        if (!normals[i]) {
          normals[i] = []
        }
        normals[i].push(normal)
      })
    })
    return normals.map(vs => {
      const sumV = vs.reduce((sum, val):Vec3 => sum.add(val), new Vec3(0, 0, 0))
      return sumV.normalize()
    })
  }
}