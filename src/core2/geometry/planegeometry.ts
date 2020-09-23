import { Geometry } from "../geometry.js";
import { Vec2 } from "../../math/vec2.js"
import { Vec3 } from "../../math/vec3.js"
import { Face3} from "../../math/face3.js"

export class PlaneGeometry extends Geometry {
  x:number
  y:number
  constructor(x:number=1, y:number=1) {
    super()
    this.x = x
    this.y = y
    this.setSize(x, y)
  }

  setSize(x:number, y:number) {
    this.x = x
    this.y = y
    const x1 = this.x/2
    const x2 = -this.x/2
    const y1 = this.y/2
    const y2 = -this.y/2
    this.vertices = [
      new Vec3(x1, y1, 0),
      new Vec3(x2, y1, 0),
      new Vec3(x1, y2, 0),
      new Vec3(x2, y2, 0),
    ]
    this.indices = [
      new Face3(1,0,3),
      new Face3(3,0,2), 
    ]
    this.normals = [
      new Vec3(0, 0, 1),
      new Vec3(0, 0, 1),
      new Vec3(0, 0, 1),
      new Vec3(0, 0, 1),
    ]
    /*
    this.normals = [
      new Vec3(0, 0, -1),
      new Vec3(0, 0, -1),
      new Vec3(0, 0, -1),
      new Vec3(0, 0, -1),
    ]
    */
    this.uvs = [
      new Vec2(1,1), new Vec2(0,1), new Vec2(1,0), new Vec2(0,0),
    ]
  }
}