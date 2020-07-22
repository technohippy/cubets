import { Vec2 } from '../math/vec2.js'
import { Vec3 } from '../math/vec3.js'
import { Face3 } from '../math/face3.js'
import { Transform3 } from '../math/transform3.js'
import { RGBAColor } from '../math/rgbacolor.js'

export class Geometry {
  vertices:Vec3[] = []
  indices:Face3[] = []
  normals:Vec3[] = []
  uvs:Vec2[] = []
  colors:RGBAColor[] = []

  getVertices(transformedVertices:Vec3[]): Float32Array {
    return new Float32Array(transformedVertices.map(v => v.toArray()).flat())
  }

  getNormals(transformedVertices:Vec3[]): Float32Array {
    const normals = Geometry.computeNormals(this.indices, transformedVertices)
    return new Float32Array(normals.map(v => v.toArray()).flat())
  }

  getTextureCoords(): Float32Array {
    return new Float32Array(this.uvs.map(uv => uv.toArray()).flat())
  }

  getIndices(wireframe:boolean): Uint16Array {
    if (wireframe) {
      return new Uint16Array(this.indices.map(face => face.toLineArray()).flat())
    } else {
      return new Uint16Array(this.indices.map(face => face.toArray()).flat())
    }
  }

  hasVertexColors(): boolean {
    return 0 < this.colors.length
  }

  getColors(): Float32Array {
    if (this.hasVertexColors()) {
      return new Float32Array(this.colors.map(color => color.toArray()).flat())
    } else {
      return new Float32Array(this.vertices.map(_ => [0, 0, 0, 0]).flat())
    }
  }

  transformVertices(transform:Transform3): Vec3[] {
    return this.vertices.map(v => {
      const vv = v.clone()
      transform.apply(vv)
      return vv
    })
  }

  static computeNormals(indices:Face3[], vertices:Vec3[]): Vec3[] {
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

  protected _computeUvs(): Vec2[] {
    const min = new Vec3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
    const max = new Vec3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    this.indices.forEach(face => {
      [
        this.vertices[face.p1],
        this.vertices[face.p2],
        this.vertices[face.p3],
      ].forEach(v => {
        ["x", "y", "z"].forEach(axis => {
          //@ts-ignore
          if (v[axis] < min[axis]) min[axis] = v[axis]
          //@ts-ignore
          if (max[axis] < v[axis]) max[axis] = v[axis]
        })
      })
    })

    const w = max.x - min.x
    const h = max.y - min.y
    const uvs: Vec2[] = []
    this.vertices.forEach(v => {
      uvs.push(new Vec2((v.x - min.x) / w, (max.y - v.y) / h))
    })
    return uvs
  }

  computeNormals() {
    this.normals = Geometry.computeNormals(this.indices, this.vertices)
  }

  computeUvs() {
    this.uvs = this._computeUvs()
  }
}