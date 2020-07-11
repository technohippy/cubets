import { Vec3 } from "../math/vec3.js"
import { Camera } from "../core/camera.js"
import { PolarCoord } from "../math/polarcoord.js"

export class OrbitCameraControl {
  camera:Camera
  container:HTMLElement
  target:Vec3
  radius:number
  cameraPolarCoord:PolarCoord
  moving = false

  mousedownEvent?: (this: HTMLElement, ev: MouseEvent) => any
  mouseupEvent?: (this: HTMLElement, ev: MouseEvent) => any
  mouseleaveEvent?: (this: HTMLElement, ev: MouseEvent) => any
  mousemoveEvent?: (this: HTMLElement, ev: MouseEvent) => any

  constructor(camera:Camera, target:Vec3=new Vec3(), container?:string | HTMLElement) {
    if (container === undefined) {
      this.container = camera.renderer.container
    } else if (typeof container === "string") {
      container = document.getElementById(container)!
      if (console === undefined) {
        throw `invalid element id:${container}`
      }
      this.container = container
    } else {
      this.container = container
    }
    this.camera = camera
    this.target = target
    this.radius = this.camera.position.distance(this.target)
    this.cameraPolarCoord = this.camera.position.clone().subtract(this.target).toPolar()
    this.camera.followTarget(this.target)

    this.attachEvents()
  }

  attachEvents() {
    if (!this.mousedownEvent) {
      this.mousedownEvent = evt => {
        this.moving = true
      }
      this.mouseupEvent = evt => {
        this.moving = false
      }
      this.mouseleaveEvent = evt => {
        this.moving = false
      }
      this.mousemoveEvent = evt => {
        if (!this.moving) return
        this.cameraPolarCoord.phai += evt.movementX / 180 * Math.PI
        this.cameraPolarCoord.theta -= evt.movementY / 180 * Math.PI
        this.cameraPolarCoord.theta = this._clamp(this.cameraPolarCoord.theta, 0, Math.PI) 
        const nextPosition = this.cameraPolarCoord.toVec3().add(this.target)
        this.camera.position.copy(nextPosition)
      }
    }

    this.container.addEventListener("mousedown", this.mousedownEvent!)
    this.container.addEventListener("mouseup", this.mouseupEvent!)
    this.container.addEventListener("mouseleave", this.mouseleaveEvent!)
    this.container.addEventListener("mousemove", this.mousemoveEvent!)
  }

  detatchEvents() {
    if (this.mousedownEvent) {
      this.container.removeEventListener("mousedown", this.mousedownEvent!)
      this.container.removeEventListener("mouseup", this.mouseupEvent!)
      this.container.removeEventListener("mouseleave", this.mouseleaveEvent!)
      this.container.removeEventListener("mousemove", this.mousemoveEvent!)
    }
  }

  private _clamp(val:number, min:number, max:number) {
    return Math.max(min, Math.min(max, val))
  }
}