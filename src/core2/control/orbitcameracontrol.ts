import { Vec2 } from "../../math/vec2.js"
import { Vec3 } from "../../math/vec3.js"
import { Camera } from "../camera.js"
import { PolarCoord } from "../../math/polarcoord.js"
import { CameraControl } from "./cameracontrol.js"

export class OrbitCameraControl extends CameraControl {
  target:Vec3
  initialRadius?:number
  cameraPolarCoord?:PolarCoord
  moving = false

  prevPoints:Vec2[] = []

  mousedownEvent?: (this: HTMLElement, ev: MouseEvent) => any
  mouseupEvent?: (this: HTMLElement, ev: MouseEvent) => any
  mouseleaveEvent?: (this: HTMLElement, ev: MouseEvent) => any
  mousemoveEvent?: (this: HTMLElement, ev: MouseEvent) => any
  mousewheelEventListener?: (this: HTMLElement, ev: MouseEvent) => any

  touchstartEvent?: (this: HTMLElement, ev: TouchEvent) => any
  touchendEvent?: (this: HTMLElement, ev: TouchEvent) => any
  touchmoveEvent?: (this: HTMLElement, ev: TouchEvent) => any

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
    //camera.followTarget(this.target)
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

    this.container!.addEventListener("touchstart", this.touchstartEvent!)
    this.container!.addEventListener("touchend", this.touchendEvent!)
    this.container!.addEventListener("touchmove", this.touchmoveEvent!)
  }

  detachEvents() {
    if (this.mousedownEvent) {
      this.container!.removeEventListener("mousedown", this.mousedownEvent!)
      this.container!.removeEventListener("mouseup", this.mouseupEvent!)
      this.container!.removeEventListener("mouseleave", this.mouseleaveEvent!)
      this.container!.removeEventListener("mousemove", this.mousemoveEvent!)
      //@ts-ignore
      this.container!.removeEventListener("mousewheel", this.mousewheelEventListener!)

      this.container!.removeEventListener("touchstart", this.touchstartEvent!)
      this.container!.removeEventListener("touchend", this.touchendEvent!)
      this.container!.removeEventListener("touchmove", this.touchmoveEvent!)
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
      evt.preventDefault()
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

    this.touchstartEvent = evt => {
      this.prevPoints = []
      for (let i = 0; i < evt.touches.length; i++) {
        const touch = evt.touches[i]
        this.prevPoints.push(new Vec3(touch.clientX, touch.clientY))
      }
    }
    this.touchendEvent = evt => {
      this.prevPoints = []
      for (let i = 0; i < evt.touches.length; i++) {
        const touch = evt.touches[i]
        this.prevPoints.push(new Vec3(touch.clientX, touch.clientY))
      }
    }
    this.touchmoveEvent = evt => {
      evt.preventDefault()
      if (1 < evt.touches.length) {
        // pinch in/out
        const prevDistance = this.prevPoints[0].distance(this.prevPoints[1])
        const t0 = evt.touches[0]
        const t1 = evt.touches[1]
        const p0 = new Vec2(t0.clientX, t0.clientY)
        const p1 = new Vec2(t1.clientX, t1.clientY)
        const distance = p0.distance(p1)

        this.cameraPolarCoord!.radius += (prevDistance - distance) / 3
        this._update()

        this.prevPoints[0] = p0
        this.prevPoints[1] = p1
      } else {
        // swipe
        const touch = evt.touches[0]
        const prevPoint = this.prevPoints[0]

        this.cameraPolarCoord!.phai += (touch.clientX - prevPoint.x) / 180 * Math.PI
        this.cameraPolarCoord!.theta -= (touch.clientY - prevPoint.y) / 180 * Math.PI
        this._update()

        this.prevPoints.length = 1
        this.prevPoints[0].x = touch.clientX
        this.prevPoints[0].y = touch.clientY
      }
    }
  }

  private _update() {
      this.cameraPolarCoord!.theta = this._clamp(this.cameraPolarCoord!.theta, 0, Math.PI) 
      this.cameraPolarCoord!.radius = this._clamp(this.cameraPolarCoord!.radius, 0.5 * this.initialRadius!, 2 * this.initialRadius!)
      const nextPosition = this.cameraPolarCoord!.toVec3().add(this.target)
      this.camera!.position.copy(nextPosition)
  }
}