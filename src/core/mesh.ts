import { Geometry } from "./geometry.js";
import { Material } from "./material.js";
import { Transform3 } from "../math/transform3.js"
import { Vec3 } from "../math/vec3.js"
import { Quat } from "../math/quat.js"
import { Scene } from "./scene.js";
import { Renderer } from "./renderer.js";
import { Texture } from "./texture.js";
import { CubeTexture } from "./cubetexture.js";

export class Mesh {
  skipRender = false

  children: ChildMesh[] = []

  geometry: Geometry
  material: Material

  position = new Vec3()
  rotation = new Quat()
  transforms: Transform3[] = []
  center = new Vec3() // center of rotation

  verticesBuffer?: WebGLBuffer
  indicesBuffer?: WebGLBuffer
  normalBuffer?: WebGLBuffer
  textureCoordsBuffer?: WebGLBuffer

  constructor(geometry: Geometry, material: Material) {
    this.geometry = geometry
    this.material = material
  }

  add(mesh:Mesh, localPosition:Vec3=new Vec3()) {
    this.children.push(new ChildMesh(mesh, localPosition))
  }

  forEachChild(fn: (child:Mesh, transform?:Transform3) => void) {
    const transform = this.getTransform()
    this.children.forEach(childMesh => {
      childMesh.mesh.forEachChild((child:Mesh, parentTransform?:Transform3) => {
        const t = new Transform3()
        t.multiply(transform)
        if (parentTransform) t.multiply(parentTransform)
        fn(child, t)
      })
      fn(childMesh.mesh, transform)
    })
  }

  getTransform(): Transform3 {
    const positionTransform = Transform3.translate(this.position)
    const rotationTransform = this.rotation.toTransform(this.center)

    const transform = new Transform3()
    for (let i = this.transforms.length - 1; 0 <= i; i--) {
      transform.multiply(this.transforms[i])
    }
    transform.multiply(positionTransform)
    transform.multiply(rotationTransform)


    return transform
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

  hasTexture(): boolean {
    return this.material.texture instanceof Texture && !this.hasCubeTexture()
  }

  hasCubeTexture(): boolean {
    return this.material.texture instanceof CubeTexture
  }

  setupGLBuffers(renderer:Renderer, scene:Scene, transform:Transform3) {
    const gl = renderer.gl

    this._concentrateMatrixes()
    const transformedVertices = this.geometry.transformVertices(this.getTransform())

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

class ChildMesh {
  mesh: Mesh
  localPosition: Vec3

  constructor(mesh:Mesh, localPosition:Vec3) {
    this.mesh = mesh
    this.localPosition = localPosition
  }
}