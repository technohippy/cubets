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

  setupGLBuffers(renderer:Renderer, scene:Scene) {
    const gl = renderer.gl

    this._concentrateMatrixes()
    const transformedVertices = this.geometry.transformVertices(this.position, this.rotation, this.transforms)

    const vertexLocation = scene.getVertexPositionAttribLocation(renderer)
    if (0 <= vertexLocation) {
      this.verticesBuffer = gl.createBuffer()!
      gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, this.geometry.getVertices(transformedVertices), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(vertexLocation)
      gl.vertexAttribPointer(vertexLocation, 3, gl.FLOAT, false, 0, 0)
    }

    const normalLocation = scene.getVertexNormalAttribLocation(renderer)
    if (0 <= normalLocation) {
      this.normalBuffer = gl.createBuffer()!
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, this.geometry.getNormals(transformedVertices), gl.STATIC_DRAW)
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