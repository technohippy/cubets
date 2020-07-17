import { Vec3 } from "../math/vec3.js"
import { Camera } from "../core/camera.js"
import { PolarCoord } from "../math/polarcoord.js"
import { CameraControl } from "./cameracontrol.js"

export class OrbitCameraControl extends CameraControl {
  target:Vec3
  initialRadius?:number
  cameraPolarCoord?:PolarCoord
  moving = false

  mousedownEvent?: (this: HTMLElement, ev: MouseEvent) => any
  mouseupEvent?: (this: HTMLElement, ev: MouseEvent) => any
  mouseleaveEvent?: (this: HTMLElement, ev: MouseEvent) => any
  mousemoveEvent?: (this: HTMLElement, ev: MouseEvent) => any
  mousewheelEventListener?: (this: HTMLElement, ev: MouseEvent) => any

  constructor(target:Vec3=new Vec3(), container?:string | HTMLElement) {
    super()
    if (container) {
      if (typeof container === "string") {
        container = document.getElementById(container)!
        if (console === undefined) {
          throw `invalid element id:${container}`
        }
      }
      this.container = container
    }
    this.target = target
  }

  setCamera(camera: Camera) {
    super.setCamera(camera)
    this.initialRadius = camera.position.distance(this.target)
    this.cameraPolarCoord = camera.position.clone().subtract(this.target).toPolar()
    camera.followTarget(this.target)
  }

  attachEvents() {
    if (!this.mousedownEvent) {
      this._setupEvents()
    }

    this.container!.addEventListener("mousedown", this.mousedownEvent!)
    this.container!.addEventListener("mouseup", this.mouseupEvent!)
    this.container!.addEventListener("mouseleave", this.mouseleaveEvent!)
    this.container!.addEventListener("mousemove", this.mousemoveEvent!)
    //@ts-ignore
    this.container!.addEventListener("mousewheel", this.mousewheelEventListener!)
  }

  detachEvents() {
    if (this.mousedownEvent) {
      this.container!.removeEventListener("mousedown", this.mousedownEvent!)
      this.container!.removeEventListener("mouseup", this.mouseupEvent!)
      this.container!.removeEventListener("mouseleave", this.mouseleaveEvent!)
      this.container!.removeEventListener("mousemove", this.mousemoveEvent!)
      //@ts-ignore
      this.container!.removeEventListener("mousewheel", this.mousewheelEventListener!)
    }
  }

  private _setupEvents() {
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
      this.cameraPolarCoord!.phai += evt.movementX / 180 * Math.PI
      this.cameraPolarCoord!.theta -= evt.movementY / 180 * Math.PI
      this._update()
    }
    this.mousewheelEventListener = evt => {
      evt.preventDefault()
      this.cameraPolarCoord!.radius += (evt as WheelEvent).deltaY
      this._update()
    }
  }

  private _update() {
      this.cameraPolarCoord!.theta = this._clamp(this.cameraPolarCoord!.theta, 0, Math.PI) 
      this.cameraPolarCoord!.radius = this._clamp(this.cameraPolarCoord!.radius, 0.5 * this.initialRadius!, 2 * this.initialRadius!)
      const nextPosition = this.cameraPolarCoord!.toVec3().add(this.target)
      this.camera!.position.copy(nextPosition)
  }
}