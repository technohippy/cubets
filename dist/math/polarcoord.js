import { Vec3 } from "./vec3.js";
export class PolarCoord {
    constructor(radius, theta, phai) {
        this.radius = radius;
        this.theta = theta;
        this.phai = phai;
    }
    toVec3() {
        const x = this.radius * Math.sin(this.theta) * Math.cos(this.phai);
        const z = this.radius * Math.sin(this.theta) * Math.sin(this.phai);
        const y = this.radius * Math.cos(this.theta);
        return new Vec3(x, y, z);
    }
}
