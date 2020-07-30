import { Vec3 } from "../../math/vec3.js";
import { Boid } from "./boid.js";
export class BoidsWorld {
    constructor(size, boidsCount, flockCount = 1) {
        this.boids = [];
        this.size = size;
        for (let i = 0; i < boidsCount; i++) {
            const flockId = Math.ceil(Math.random() * flockCount);
            const position = new Vec3(this.size.x * Math.random(), this.size.y * Math.random(), this.size.z * Math.random());
            this.boids.push(new Boid(this, flockId));
        }
    }
}
