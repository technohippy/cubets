import { Vec3 } from "../../math/vec3.js";
import { Boid } from "./boid.js";

export class BoidsWorld {
  size:Vec3
  boids:Boid[] = []

  constructor(size:Vec3, boidsCount:number, flockCount:number=1) {
    this.size = size
    for (let i = 0; i < boidsCount; i++) {
      const flockId = Math.ceil(Math.random() * flockCount)
      const position = new Vec3(
        this.size.x * Math.random() - this.size.x/2,
        this.size.y * Math.random() - this.size.y/2,
        this.size.z * Math.random() - this.size.z/2,
      )
      const velocity = new Vec3(
        Math.random(),
        Math.random(),
        Math.random(),
      ).normalize()
      this.boids.push(new Boid(this, flockId, position, velocity))
    }
  }

  getBoidsInFov(center:Boid, fov:number, sameFlock:boolean): Boid[] {
    return this.boids.filter(b => {
      if (sameFlock) {
        return b !== center && b.flock === center.flock &&  b.position.distance(center.position) < fov 
      } else {
        return b !== center && b.position.distance(center.position) < fov 
      }
    })
  }

  step() {
    this.boids.forEach(boid => {
      boid.step()
    })
  }
}