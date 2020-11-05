import { CubeTexture } from "./cubetexture.js";
import { Scene } from "./scene.js";
import { Mesh } from "./mesh.js";
import { Renderer } from "./renderer.js";
import { PerspectiveCamera } from "../camera/perspectivecamera.js";
import { Camera } from "./camera.js";
import { SceneContext } from "./context/scenecontext.js";

export class ReflectionTexture extends CubeTexture {
  size:number
  renderer:Renderer

  constructor(size:number=256) {
    super(
      new Image(size, size),
      new Image(size, size), 
      new Image(size, size), 
      new Image(size, size), 
      new Image(size, size), 
      new Image(size, size),
    )
    this.size = size
    const dummyCanvas = document.createElement("canvas") // TODO:消したい
    dummyCanvas.width = size
    dummyCanvas.height = size
    this.renderer = new Renderer(dummyCanvas)
  }

  loadImage():Promise<any> {
    // ignore
    return new Promise(resolve => resolve())
  }

  render(scene:Scene, baseCamera:Camera, baseContext:SceneContext, thisMesh:Mesh) {
    const camera = baseCamera.clone()
    const context = baseContext.clone()
    thisMesh.hidden = true
    console.log("TBD")
    thisMesh.hidden = false
  }
}