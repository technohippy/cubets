import { Camera } from "../core/camera.js";

//@ts-ignore
import { glMatrix, mat4 } from "../../node_modules/gl-matrix/esm/index.js"
import { Scene } from "../core/scene.js";
import { FilterScene } from "../core/filter.js";
glMatrix.setMatrixArrayType(Array)

export class ShaderCamera extends Camera {
  async start(scene: Scene, loop:boolean=true) {
    if (scene.meshes.length === 0) {
      (scene as FilterScene).setup()
    }
    super.start(scene, loop)
  }

  /** @internal */
  setupProjectionMatrix() {
    mat4.identity(this.projectionMatrix)
  }
}