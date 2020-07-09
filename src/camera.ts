import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js";
import { Filter } from "./filter.js";
//@ts-ignore
import { glMatrix, mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } from "../node_modules/gl-matrix/esm/index.js"

glMatrix.setMatrixArrayType(Array)

export class Camera {
  renderer: Renderer
  filters: Filter[] = []
  projectionMatrix: number[] = mat4.create()
  modelViewMatrix: number[] = mat4.create()
  normalMatrix: number[] = mat4.create()

  constructor(renderer?: Renderer | string) {
    if (typeof renderer === "string") {
      renderer = new Renderer(renderer)
    }
    this.renderer = renderer ?? new Renderer()
  }

  initMatrixes() {
    const ar = this.renderer.container.width / this.renderer.container.height
    mat4.perspective(this.projectionMatrix, 45, ar, 0.1, 50)

    mat4.identity(this.modelViewMatrix)
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, 0, -20])
    /*
    mat4.rotateX(this.modelViewMatrix, this.modelViewMatrix, Math.PI/5)
    mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, Math.PI/30)
    mat4.rotateZ(this.modelViewMatrix, this.modelViewMatrix, Math.PI/5)
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [-6, -9, -15])
    */

    mat4.copy(this.normalMatrix, this.modelViewMatrix)
    mat4.invert(this.normalMatrix, this.normalMatrix)
    mat4.transpose(this.normalMatrix, this.normalMatrix)
  }

  shot(scene: Scene) {
    this.initMatrixes()
    this.renderer.setupGLContext()
    scene.eachMesh(mesh => {
      mesh.material.setup(this.renderer.gl!)
    })
    this.renderer.render(scene, this)
  }
}