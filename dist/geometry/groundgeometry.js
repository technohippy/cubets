import { Geometry } from "../core/geometry.js";
import { Vec3 } from "../math/vec3.js";
import { Face3 } from "../math/face3.js";
import { Vec2 } from "../math/vec2.js";
export class GroundGeometry extends Geometry {
    constructor(x = 1, z = 1, numX = 1, numZ = 1) {
        super();
        this.x = x;
        this.z = z;
        this.numX = numX;
        this.numZ = numZ;
        this.setSize(x, z);
    }
    setSize(x, z, numX = this.numX, numZ = this.numZ) {
        this.x = x;
        this.z = z;
        this.numX = numX;
        this.numZ = numZ;
        const minX = -this.x / 2;
        const minZ = -this.z / 2;
        const dx = this.x / this.numX;
        const dz = this.z / this.numZ;
        this.vertices = [];
        for (let zi = 0; zi < this.numZ; zi++) {
            for (let xi = 0; xi < this.numX; xi++) {
                //this.vertices.push(new Vec3(minX + dx * xi, 0, minZ + dz * zi))
                this.vertices.push(new Vec3(minX + dx * xi, 0, minZ + dz * zi));
            }
        }
        this.indices = [];
        for (let zi = 0; zi < this.numZ - 1; zi++) {
            for (let xi = 0; xi < this.numX - 1; xi++) {
                const i = zi * this.numX + xi;
                this.indices.push(new Face3(i, i + this.numX, i + this.numX + 1));
                this.indices.push(new Face3(i, i + this.numX + 1, i + 1));
            }
        }
        this.normals = Geometry.computeNormals(this.indices, this.vertices);
        this.uvs = this.vertices.map(v => new Vec2(v.x / this.x, v.z / this.z));
    }
}
