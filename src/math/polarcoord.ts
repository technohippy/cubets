import { Vec3 } from "./vec3.js"

export class PolarCoord {
  radius:number
  theta:number
  phai:number

  constructor(radius:number, theta:number, phai:number) {
    this.radius = radius
    this.theta = theta
    this.phai = phai
  }

  toVec3(): Vec3 {
    const x = this.radius * Math.sin(this.theta) * Math.cos(this.phai)
    const z = this.radius * Math.sin(this.theta) * Math.sin(this.phai)
    const y = this.radius * Math.cos(this.theta)
    return new Vec3(x, y, z)
  }
}