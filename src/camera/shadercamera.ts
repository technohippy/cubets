import { Camera } from "../core/camera.js";
import { Scene } from "../core/scene.js";
import { FilterScene } from "../core/filter/filterscene.js";
import { Viewport } from "../core/viewport.js";
import { ShaderScene } from "../core/shaderscene.js";

//@ts-ignore
import { glMatrix, mat4 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class ShaderCamera extends Camera {
  static async start(viewport: Viewport | string, fragmentShaderBodyFn?:string | ((fragColor:string, frameColor:string)=>string)): Promise<ShaderCamera> {
    const scene = new ShaderScene(fragmentShaderBodyFn)
    const camera = new ShaderCamera(viewport)
    camera.start(scene)
    return camera
  }

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