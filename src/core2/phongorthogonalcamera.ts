import { PhongCamera } from "./phongcamera.js";
import { Renderer } from "./renderer.js";
import { GLContext } from "../gl/glcontext.js";

//@ts-ignore
import { glMatrix, mat4 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class PhongOrthogonalCamera extends PhongCamera {
  width:number
  left?:number
  right?:number
  top?:number
  bottom?:number

  constructor(width:number, near:number, far:number) {
    super(near, far)
    this.width = width
  }

  clone():PhongOrthogonalCamera {
    return new PhongOrthogonalCamera(this.width, this.near, this.far)
  }

  setup(renderer:Renderer) {
    super.setup(renderer)

    const height = this.width / this.aspectRatio!
    this.left = -this.width/2
    this.right = this.width/2
    this.top = height / 2
    this.bottom = -height / 2
  }

  writeContext(context:GLContext) {
    mat4.ortho(this.projectionMatrix, this.left!, this.right!, this.bottom!, this.top!, this.near, this.far)

    super.writeContext(context)
  }
}