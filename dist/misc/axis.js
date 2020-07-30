import { Mesh } from "../core/mesh.js";
import { RGBAColor } from "../math/rgbacolor.js";
import { Geometry } from "../core/geometry.js";
import { Vec3 } from "../math/vec3.js";
import { Face3 } from "../math/face3.js";
export class Axis extends Mesh {
    constructor(size, material) {
        super(new AxisGeometry(size), material);
        this.material.wireframe = true;
    }
}
export class AxisGeometry extends Geometry {
    constructor(size = 1) {
        super();
        this.size = 1;
        this.vertices = [
            new Vec3(0, 0, 0),
            new Vec3(size, 0, 0),
            new Vec3(0, 0, 0),
            new Vec3(0, size, 0),
            new Vec3(0, 0, 0),
            new Vec3(0, 0, size)
        ];
        this.indices = [
            new Face3(0, 1, 1),
            new Face3(2, 3, 3),
            new Face3(4, 5, 5),
        ];
        this.normals = Geometry.computeNormals(this.indices, this.vertices);
        this.colors = [
            new RGBAColor(1, 0, 0),
            new RGBAColor(1, 0, 0),
            new RGBAColor(0, 1, 0),
            new RGBAColor(0, 1, 0),
            new RGBAColor(0, 0, 1),
            new RGBAColor(0, 0, 1),
        ];
    }
}
