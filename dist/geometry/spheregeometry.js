import { Geometry } from "../core/geometry.js";
import { Vec3 } from "../math/vec3.js";
import { Face3 } from "../math/face3.js";
export class SphereGeometry extends Geometry {
    constructor(radius) {
        super();
        this.radius = radius;
        const numTheta = 10;
        const numPhi = 16;
        const dTheta = Math.PI / numTheta;
        const dPhi = 2 * Math.PI / numPhi;
        this.vertices = [new Vec3(0, -radius, 0)];
        for (let thetaId = 1; thetaId < numTheta; thetaId++) {
            for (let phiId = 0; phiId < numPhi; phiId++) {
                const theta = -Math.PI / 2 + thetaId * dTheta;
                const phi = phiId * dPhi;
                const y = radius * Math.sin(theta);
                const radius2 = Math.sqrt(Math.pow(radius, 2) - Math.pow(Math.abs(y), 2));
                this.vertices.push(new Vec3(radius2 * Math.cos(phi), y, radius2 * Math.sin(phi)));
            }
        }
        this.vertices.push(new Vec3(0, radius, 0));
        this.indices = [];
        // first line
        for (let phiId = 0; phiId < numPhi; phiId++) {
            const id = phiId + 1;
            const prevId = phiId === 0 ? 1 + numPhi - 1 : id - 1;
            this.indices.push(new Face3(0, prevId, id));
        }
        // midile line
        for (let thetaId = 1; thetaId < numTheta - 1; thetaId++) {
            for (let phiId = 0; phiId < numPhi; phiId++) {
                const id = 1 + (thetaId - 1) * numPhi + phiId;
                const prevId = phiId === 0 ? id + numPhi - 1 : id - 1;
                const upId = id + numPhi;
                const prevUpId = prevId + numPhi;
                this.indices.push(new Face3(id, prevUpId, upId));
                this.indices.push(new Face3(id, prevId, prevUpId));
            }
        }
        // last line
        const lastId = this.vertices.length - 1;
        for (let phiId = 0; phiId < numPhi; phiId++) {
            const id = lastId - numPhi + phiId;
            const prevId = phiId === 0 ? id + numPhi - 1 : id - 1;
            this.indices.push(new Face3(lastId, id, prevId));
        }
        this.normals = Geometry.computeNormals(this.indices, this.vertices);
        this.uvs = this._computeUvs();
    }
}
