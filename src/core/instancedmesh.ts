import { Geometry } from "./geometry.js";
import { Material } from "./material.js";
import { Mesh } from "./mesh.js";
import { Vec3 } from "../math/vec3.js";
import { Transform3 } from "../math/transform3.js";
import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js";

export class InstancedMesh extends Mesh {
  meshes:Mesh[] = []

  constructor(instanceCount:number, geometry:Geometry, material:Material) {
    super(geometry, material) // TODO: 不要
    for (let i = 0; i < instanceCount; i++) {
      this.meshes.push(new Mesh(geometry, material))
    }
  }

  get(i:number): Mesh {
    return this.meshes[i]
  }

  add(mesh:Mesh, localPosition:Vec3=new Vec3()) {
    throw "not implemented: add"
  }

  forEachChild(fn: (child:Mesh) => void) {
    //throw "not implemented: forEachChild"
  }

  getTransform(): Transform3 {
    throw "not implemented: getTansform"
  }

  translate(amount: Vec3) {
    throw "not implemented: translate"
  }

  rotate(rad: number, axis: Vec3) {
    throw "not implemented: rotate"
  }

  scale(scale: number) {
    throw "not implemented: scale"
  }

  resetTransform() {
    throw "not implemented: resetTransform"
  }

  hasTexture(): boolean {
    return 0 < this.meshes[0].material.textures.length
  }

  hasCubeTexture(): boolean {
    return !!this.meshes[0].material.cubeTexture
  }

  setupGLBuffers(renderer:Renderer, scene:Scene) {
    const gl = renderer.gl
    const firstMesh = this.meshes[0]
    firstMesh.setupGLBuffers(renderer, scene)
    const offsetData:number[] = []
    this.meshes.forEach(mesh => {
      const offset = mesh.position.clone().subtract(firstMesh.position)
      offsetData.push(...offset.toArray())
    })

    const offsetLocation = scene.getVertexOffsetAttribLocation(renderer)
    if (0 <= offsetLocation) {
      const offsetBuffer = gl.createBuffer()!
      gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(offsetData), gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(offsetLocation)
      gl.vertexAttribPointer(offsetLocation, 3, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(offsetLocation, 1);
    }
  }

  drawGL(gl: WebGL2RenderingContext) {
    gl.drawElementsInstanced(gl.TRIANGLES, this.geometry.indices.length * 3, gl.UNSIGNED_SHORT, 0, this.meshes.length)
  }
}