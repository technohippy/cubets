import { Geometry } from "./geometry.js";
import { Material } from "./material.js";
import { Transform3 } from "../math/transform3.js"
import { Vec3 } from "../math/vec3.js"
import { Scene } from "./scene.js";

export class Mesh {
  geometry: Geometry
  material: Material

  verticesBuffer?: WebGLBuffer
  indicesBuffer?: WebGLBuffer
  normalBuffer?: WebGLBuffer

  transforms: Transform3[] = []

  constructor(geometry: Geometry, material: Material) {
    this.geometry = geometry
    this.material = material
  }

  translate(amount: Vec3) {
    this.transforms.push(Transform3.translate(amount))
  }

  rotate(rad: number, axis: Vec3) {
    this.transforms.push(Transform3.rotate(rad, axis))
  }

  scale(scale: number) {
    this.transforms.push(Transform3.scaleScalar(scale))
  }

  resetTransform() {
    this.transforms.length = 0
  }

  getVertices(): Float32Array {
    this._concentrateMatrixes()
    return new Float32Array(this.geometry.vertices.map(v => {
      const vv = v.clone()
      this.transforms.forEach(t => t.apply(vv))
      return vv.toArray()
    }).flat())
  }

  getNormals(): Float32Array {
    this._concentrateMatrixes()
    // TODO: getVerticesで計算済みなので、cacheすることを考える
    const vertices = this.geometry.vertices.map(v => {
      const vv = v.clone()
      this.transforms.forEach(t => t.apply(vv))
      return vv
    })
    const normals = Geometry.computeNormals(this.geometry.indices, vertices)
    return new Float32Array(normals.map(v => v.toArray()).flat())
  }

  getIndices(): Uint16Array {
    return new Uint16Array(this.geometry.indices.map(i => i.toArray()).flat())
  }

  setupGLBuffers(gl: WebGL2RenderingContext, scene:Scene): {verticesBuffer:WebGLBuffer | null, indicesBuffer:WebGLBuffer | null, normalBuffer:WebGLBuffer | null} {
    this.verticesBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.getVertices(), gl.STATIC_DRAW)
    const vertexPosition = scene.getVertexPositionAttribLocation()
    gl.enableVertexAttribArray(vertexPosition)
    gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0)

    this.normalBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.getNormals(), gl.STATIC_DRAW)
    const normalPosition = scene.getVertexNormalAttribLocation()
    gl.enableVertexAttribArray(normalPosition)
    gl.vertexAttribPointer(normalPosition, 3, gl.FLOAT, false, 0, 0)

    this.indicesBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.getIndices(), gl.STATIC_DRAW)

    return {
      verticesBuffer:this.verticesBuffer,
      indicesBuffer:this.indicesBuffer,
      normalBuffer:this.normalBuffer,
    }
  }

  drawGL(gl: WebGL2RenderingContext) {
    if (this.indicesBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)
      if (this.material.wireframe) {
        gl.drawElements(gl.LINES, this.geometry.indices.length * 3, gl.UNSIGNED_SHORT, 0)
      } else {
        gl.drawElements(gl.TRIANGLES, this.geometry.indices.length * 3, gl.UNSIGNED_SHORT, 0)
      }
    }
  }

  private _concentrateMatrixes() {
    const concentration = this.transforms.pop()
    if (concentration) {
      this.transforms.reverse().forEach(t => concentration?.multiply(t))
      this.transforms.length = 0
      this.transforms.push(concentration!)
    }
  }
}