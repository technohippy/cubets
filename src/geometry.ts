import { Vec2 } from './math/vec2.js'
import { Vec3 } from './math/vec3.js'

export class Geometry {
  vertices:Vec3[] = []
  indices:number[] = []
  normals:Vec3[] = []
  uvs:Vec2[] = []
}