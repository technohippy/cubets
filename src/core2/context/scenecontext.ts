import { GLContext } from "../../gl/glcontext.js";
import { GLProgram } from "../../gl/glprogram.js";
import { LightContext } from "./lightcontext.js";
import { GeometryContext } from "./geometrycontext.js";
import { MaterialContext } from "./materialcontext.js";
import { CameraContext } from "./cameracontext.js";
import { Mesh } from "../mesh.js";
import { Light } from "../light.js";
import { Camera } from "../camera.js";
import { Scene } from "../scene.js";

export class SceneContext {
  program?:GLProgram
  context:GLContext // TODO: privateにしたい

  geometryContexts:WeakMap<any, GeometryContext> = new WeakMap()
  materialContexts:WeakMap<any, MaterialContext> = new WeakMap()
  lightContexts:WeakMap<any, LightContext> = new WeakMap()
  cameraContext?:CameraContext

  prepared = false

  constructor(...flags:number[]) {
    if (flags.length === 0) {
      flags = [
        WebGL2RenderingContext.CULL_FACE,
        WebGL2RenderingContext.DEPTH_TEST,
      ]
    }
    this.context = new GLContext(...flags)
  }

  clone():SceneContext {
    return new SceneContext(...this.context.enableFlags)
  }

  setup(scene:Scene, camera?:Camera) {
    this.program = new GLProgram(scene.getVertexShader(), scene.getFragmentShader())

    scene.eachLight(light => {
      const lightContext = light.setupContext(scene.lightConfig())
      lightContext.upload(this.context)
      this.lightContexts.set(light, lightContext)
    })

    scene.eachMesh(mesh => {
      const geometryContext = mesh.geometry.setupContext(scene.geometryConfig())
      geometryContext.upload(this.context, mesh.geometry)
      this.geometryContexts.set(mesh.geometry, geometryContext)
      if (mesh.material) {
        const materialContext = mesh.material.setupContext(scene.materialConfig())
        materialContext.upload(this.context)
        this.materialContexts.set(mesh.material, materialContext)
      }
    })

    if (camera) {
      const cameraContext = camera.setupContext(scene.cameraConfig())
      cameraContext.upload(this.context)
      this.cameraContext = cameraContext
    }
    this.prepared = true
  }

  writeCamera(camera:Camera) {
    this.cameraContext?.write(this.context, camera)
  }

  writeLight(light:Light) {
    this.lightContexts.get(light)?.write(light)
  }

  writeMesh(mesh:Mesh) {
    mesh.applyTransform()
    this.geometryContexts.get(mesh.geometry)?.write(this.context, mesh.geometry!)
    this.materialContexts.get(mesh.material)?.write(mesh.material!)
  }
}