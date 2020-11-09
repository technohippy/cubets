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

  get needClear():boolean {
    return this.context.needClear
  }

  set needClear(value:boolean) {
    this.context.needClear = value
  }

  constructor(...flags:number[]) {
    if (flags.length === 0) {
      flags = [
        //WebGL2RenderingContext.CULL_FACE,
        WebGL2RenderingContext.BLEND,
        WebGL2RenderingContext.DEPTH_TEST,
        WebGL2RenderingContext.SCISSOR_TEST,
      ]
    }
    this.context = new GLContext(...flags)
  }

  clone():SceneContext {
    return new SceneContext(...this.context.enableFlags)
  }

  setViewport(width:number, height:number, x:number=0, y:number=0) {
    this.context.viewport.width = width
    this.context.viewport.height = height
    this.context.viewport.x = x
    this.context.viewport.y = y
  }

  setupVars(scene:Scene, camera?:Camera) {
    this.program = new GLProgram(scene.getVertexShader(), scene.getFragmentShader())

    let sharedLightContext:LightContext
    scene.eachLight(light => {
      if (!sharedLightContext) {
        sharedLightContext = light.setupContext(scene.lightConfig())
        sharedLightContext.upload(this.context)
      }
      this.lightContexts.set(light, sharedLightContext)
    })

    scene.eachMesh(mesh => {
      if (!this.geometryContexts.has(mesh.geometry)) {
        const geometryContext = mesh.geometry.setupContext(scene.geometryConfig())
        geometryContext.upload(this.context, mesh.geometry)
        this.geometryContexts.set(mesh.geometry, geometryContext)
      }

      if (mesh.material) {
        if (!this.materialContexts.has(mesh.material)) {
          const materialContext = mesh.material.setupContext(scene.materialConfig())
          materialContext.upload(this.context, mesh.material)
          this.materialContexts.set(mesh.material, materialContext)
        }
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

  writeLight(light:Light, position:number=0) {
    this.lightContexts.get(light)?.write(light, position)
  }

  writeMesh(mesh:Mesh) {
    mesh.applyTransform()
    this.geometryContexts.get(mesh.geometry)?.write(this.context, mesh.geometry!, mesh.material?.wireframe)
    this.materialContexts.get(mesh.material)?.write(this.context, mesh.material!)
  }
}