import { Vec2 } from '../math/vec2.js'
import { Vec3 } from '../math/vec3.js'
import { Face3 } from '../math/face3.js'
import { Transform3 } from '../math/transform3.js'
import { Quat } from '../math/quat.js'
import { Mesh } from './mesh.js'
import { Renderer } from './renderer.js'
import { Scene } from './scene.js'

export abstract class Geometry {
  vertices:Vec3[] = []
  indices:Face3[] = []
  normals:Vec3[] = []
  uvs:Vec2[] = []

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

  transformVertices(position:Vec3, rotation:Quat, transforms:Transform3[]): Vec3[] {
    const positionTransform = Transform3.translate(position)
    const rotationTransform = rotation.toTransform()
    return this.vertices.map(v => {
      const vv = v.clone()
      rotationTransform.apply(vv)
      positionTransform.apply(vv)
      transforms.forEach(t => t.apply(vv))
      return vv
    })
  }

  setupGLBuffers(renderer:Renderer, scene:Scene, mesh:Mesh): { vertices:WebGLBuffer, normals:WebGLBuffer, indices:WebGLBuffer, textureCoords:WebGLBuffer } {
    let vertices: WebGLBuffer
    let normals: WebGLBuffer
    let indices: WebGLBuffer
    let textureCoords: WebGLBuffer

    const gl = renderer.gl

    const transformedVertices = this.transformVertices(mesh.position, mesh.rotation, mesh.transforms)

    const vertexLocation = scene.getVertexPositionAttribLocation(renderer)
    if (0 <= vertexLocation) {
      vertices = gl.createBuffer()!
      gl.bindBuffer(gl.ARRAY_BUFFER, vertices)
      gl.bufferData(gl.ARRAY_BUFFER, this.getVertices(transformedVertices), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(vertexLocation)
      gl.vertexAttribPointer(vertexLocation, 3, gl.FLOAT, false, 0, 0)
    }

    const normalLocation = scene.getVertexNormalAttribLocation(renderer)
    if (0 <= normalLocation) {
      normals = gl.createBuffer()!
      gl.bindBuffer(gl.ARRAY_BUFFER, normals)
      gl.bufferData(gl.ARRAY_BUFFER, this.getNormals(transformedVertices), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(normalLocation)
      gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0)
    }

    if (scene.hasTexture()) {
      const textureCoordsLocation = scene.getVertexTextureCoordsAttribLocation(renderer)
      this.textureCoordsBuffer = gl.createBuffer()!
      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordsBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, this.geometry.getTextureCoords(), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(textureCoordsLocation)
      gl.vertexAttribPointer(textureCoordsLocation, 2, gl.FLOAT, false, 0, 0)
    }

    this.indicesBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.geometry.getIndices(this.material.wireframe), gl.STATIC_DRAW)

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
}