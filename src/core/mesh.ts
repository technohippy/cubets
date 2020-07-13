import { Geometry } from "./geometry.js";
import { Material } from "./material.js";
import { Transform3 } from "../math/transform3.js"
import { Vec3 } from "../math/vec3.js"
import { Quat } from "../math/quat.js"
import { Scene } from "./scene.js";
import { Renderer } from "./renderer.js";

export class Mesh {
  geometry: Geometry
  material: Material

  position = new Vec3()
  rotation = new Quat()
  transforms: Transform3[] = []

  verticesBuffer?: WebGLBuffer
  indicesBuffer?: WebGLBuffer
  normalBuffer?: WebGLBuffer
  textureCoordsBuffer?: WebGLBuffer

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
    const positionTransform = Transform3.translate(this.position)
    const rotationTransform = this.rotation.toTransform()
    this._concentrateMatrixes()
    return new Float32Array(this.geometry.vertices.map(v => {
      const vv = v.clone()
      rotationTransform.apply(vv)
      positionTransform.apply(vv)
      this.transforms.forEach(t => t.apply(vv))
      return vv.toArray()
    }).flat())
  }

  getNormals(): Float32Array {
    const positionTransform = Transform3.translate(this.position)
    const rotationTransform = this.rotation.toTransform()
    this._concentrateMatrixes()
    // TODO: getVerticesで計算済みなので、cacheすることを考える
    const vertices = this.geometry.vertices.map(v => {
      const vv = v.clone()
      rotationTransform.apply(vv)
      positionTransform.apply(vv)
      this.transforms.forEach(t => t.apply(vv))
      return vv
    })
    const normals = Geometry.computeNormals(this.geometry.indices, vertices)
    return new Float32Array(normals.map(v => v.toArray()).flat())
  }

  getTextureCoords(): Float32Array {
    return new Float32Array(this.geometry.uvs.map(uv => uv.toArray()).flat())
  }

  getIndices(): Uint16Array {
    if (this.material.wireframe) {
      return new Uint16Array(this.geometry.indices.map(face => face.toLineArray()).flat())
    } else {
      return new Uint16Array(this.geometry.indices.map(face => face.toArray()).flat())
    }
  }

  setupGLBuffers(renderer:Renderer, scene:Scene): {verticesBuffer:WebGLBuffer | null, indicesBuffer:WebGLBuffer | null, normalBuffer:WebGLBuffer | null} {
    const gl = renderer.gl
    this.verticesBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.getVertices(), gl.STATIC_DRAW)
    const vertexLocation = scene.getVertexPositionAttribLocation(renderer)
    gl.enableVertexAttribArray(vertexLocation)
    gl.vertexAttribPointer(vertexLocation, 3, gl.FLOAT, false, 0, 0)

    this.normalBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.getNormals(), gl.STATIC_DRAW)
    const normalLocation = scene.getVertexNormalAttribLocation(renderer)
    gl.enableVertexAttribArray(normalLocation)
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0)

    this.textureCoordsBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.getTextureCoords(), gl.STATIC_DRAW)
    const textureCoordsLocation = scene.getVertexTextureCoordsAttribLocation(renderer)
    gl.enableVertexAttribArray(textureCoordsLocation)
    gl.vertexAttribPointer(textureCoordsLocation, 2, gl.FLOAT, false, 0, 0)

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
        gl.drawElements(gl.LINES, this.geometry.indices.length * 3 * 2, gl.UNSIGNED_SHORT, 0)
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