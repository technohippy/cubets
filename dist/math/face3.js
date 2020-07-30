import { Vec3 } from "./vec3.js";
//@ts-ignore
import { glMatrix, vec3 } from "../../node_modules/gl-matrix/esm/index.js";
glMatrix.setMatrixArrayType(Array);
export class Face3 {
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
    normal(vertices) {
        if (vertices[this.p1] === undefined)
            throw `invalid p1:${this.p1} in (${this.p1}, ${this.p2}, ${this.p3}: max:${vertices.length - 1})`;
        if (vertices[this.p2] === undefined)
            throw `invalid p2:${this.p2} in (${this.p1}, ${this.p2}, ${this.p3}: max:${vertices.length - 1})`;
        if (vertices[this.p3] === undefined)
            throw `invalid p3:${this.p3} in (${this.p1}, ${this.p2}, ${this.p3}: max:${vertices.length - 1})`;
        const v1 = vertices[this.p1].toArray();
        const v2 = vertices[this.p2].toArray();
        const v3 = vertices[this.p3].toArray();
        const v12 = vec3.subtract(v2, v1, v2);
        const v13 = vec3.subtract(v3, v1, v3);
        const norm = vec3.cross(vec3.create(), v12, v13);
        return new Vec3(...norm);
    }
    toArray() {
        return [this.p1, this.p2, this.p3];
    }
    toLineArray() {
        return [this.p1, this.p2, this.p2, this.p3, this.p3, this.p1];
    }
}
