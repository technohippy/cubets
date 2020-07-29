import { Vec3 } from "../../math/vec3.js";
import { Boid } from "./boid.js";

export class BoidsWorld {
  size:Vec3
  center:Vec3
  boids:Boid[] = []

  constructor(size:Vec3, boidsCount:number, flockCount:number=1, center:Vec3=new Vec3()) {
    this.size = size
    this.center = center
    for (let i = 0; i < boidsCount; i++) {
      const flockId = Math.ceil(Math.random() * flockCount)
      const position = new Vec3(
        this.size.x * Math.random() - this.size.x/2 + center.x,
        this.size.y * Math.random() - this.size.y/2 + center.y,
        this.size.z * Math.random() - this.size.z/2 + center.z,
      )
      const velocity = new Vec3(
        Math.random(),
        Math.random(),
        Math.random(),
      ).normalize()
      this.boids.push(new Boid(this, flockId, position, velocity))
    }
  }

  getBoidsInFov(center:Boid, fov:number, maxAngle:number, sameFlock:boolean): Boid[] {
    return this.boids.filter(b => {
      const view = b.position.clone().subtract(center.position)
      const angle = center.velocity.angleTo(view)
      if (sameFlock) {
        return b !== center && b.flock === center.flock &&  b.position.distance(center.position) < fov && angle < maxAngle
      } else {
        return b !== center && b.position.distance(center.position) < fov  && angle < maxAngle
      }
    })
  }

  step() {
    this.boids.forEach(boid => {
      boid.step()
    })
  }
}