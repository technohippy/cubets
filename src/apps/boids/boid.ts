import { Vec3 } from "../../math/vec3.js";
import { BoidsWorld } from "./boidsworld.js";

export class Boid {
  world: BoidsWorld
  flock: number
  position: Vec3
  velocity: Vec3 

  constructor(world:BoidsWorld, flock:number, position:Vec3=new Vec3(), velocity:Vec3=new Vec3()) {
    this.world = world
    this.flock = flock
    this.position = position
    this.velocity = velocity
  }

  step() {
    const SameFlock = true
    // separation
    const separationBoids = this.world.getBoidsInFov(this, 10, !SameFlock)
    const separationVec = new Vec3()
    separationBoids.forEach(b => {
      const diff = this.position.clone().subtract(b.position)
      separationVec.add(diff.divideScalar(Math.pow(diff.length()*0.25, 2)))
    })
    if (0 < separationBoids.length) separationVec.divideScalar(separationBoids.length)

    // alignment
    const alignmentBoids = this.world.getBoidsInFov(this, 20, SameFlock)
    const alignmentVec = new Vec3()
    alignmentBoids.forEach(b => {
      alignmentVec.add(b.velocity)
    })
    if (0 < alignmentBoids.length) alignmentVec.divideScalar(alignmentBoids.length)

    // cohesion
    const cohesionBoids = this.world.getBoidsInFov(this, 30, SameFlock)
    const cohesionVec = new Vec3()
    cohesionBoids.forEach(b => {
      cohesionVec.add(b.position)
    })
    if (0 < cohesionBoids.length) cohesionVec.divideScalar(cohesionBoids.length)
    cohesionVec.subtract(this.position)
    if (1 < cohesionVec.length()) cohesionVec.normalize()

    const newVelocity = separationVec.add(alignmentVec).add(cohesionVec).normalize()

    // boundary
    const boundaryVec = new Vec3()
    if (this.position.x < -this.world.size.x/2) {
      boundaryVec.add(new Vec3(1, 0, 0))
    }
    if (this.world.size.x/2 < this.position.x) {
      boundaryVec.add(new Vec3(-1, 0, 0))
    }
    if (this.position.y < -this.world.size.y/2) {
      boundaryVec.add(new Vec3(0, 1, 0))
    }
    if (this.world.size.y/2 < this.position.y) {
      boundaryVec.add(new Vec3(0, -1, 0))
    }
    if (this.position.z < -this.world.size.z/2) {
      boundaryVec.add(new Vec3(0, 0, 1))
    }
    if (this.world.size.z/2 < this.position.z) {
      boundaryVec.add(new Vec3(0, 0, -1))
    }
    newVelocity.add(boundaryVec)

    const limit = 0.1
    const acceleration = newVelocity.clone().subtract(this.velocity)
    if (limit < acceleration.length()) {
      acceleration.normalize().multiplyScalar(limit)
    }
    this.velocity.add(acceleration)
    if (this.velocity.length() < 1) {
      this.velocity.normalize().multiplyScalar(
        Math.min(1, this.velocity.length() * 1.2)
      )
    }

    this.position.add(this.velocity)
  }
}