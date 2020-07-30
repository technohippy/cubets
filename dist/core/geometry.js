import { Vec2 } from '../math/vec2.js';
import { Vec3 } from '../math/vec3.js';
//@ts-ignore
import { glMatrix, vec3 } from "../../node_modules/gl-matrix/esm/index.js";
glMatrix.setMatrixArrayType(Array);
export class Geometry {
    constructor() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.uvs = [];
        this.colors = [];
    }
    getVertices(transformedVertices) {
        return new Float32Array(transformedVertices.map(v => v.toArray()).flat());
    }
    getNormals(transformedVertices) {
        const normals = Geometry.computeNormals(this.indices, transformedVertices);
        return new Float32Array(normals.map(v => v.toArray()).flat());
    }
    getTextureCoords() {
        return new Float32Array(this.uvs.map(uv => uv.toArray()).flat());
    }
    getIndices(wireframe) {
        if (wireframe) {
            return new Uint16Array(this.indices.map(face => face.toLineArray()).flat());
        }
        else {
            return new Uint16Array(this.indices.map(face => face.toArray()).flat());
        }
    }
    hasVertexColors() {
        return 0 < this.colors.length;
    }
    getColors() {
        if (this.hasVertexColors()) {
            return new Float32Array(this.colors.map(color => color.toArray()).flat());
        }
        else {
            return new Float32Array(this.vertices.map(_ => [0, 0, 0, 0]).flat());
        }
    }
    transformVertices(transform) {
        return this.vertices.map(v => {
            const vv = v.clone();
            transform.apply(vv);
            return vv;
        });
    }
    static computeNormals(indices, vertices) {
        const normals = [];
        indices.forEach(index => {
            const normal = index.normal(vertices);
            index.toArray().forEach(i => {
                if (!normals[i]) {
                    normals[i] = [];
                }
                normals[i].push(normal);
            });
        });
        return normals.map(vs => {
            const sumV = vs.reduce((sum, val) => sum.add(val), new Vec3(0, 0, 0));
            return sumV.normalize();
        });
    }
    _computeUvs() {
        const min = new Vec3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        const max = new Vec3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        this.indices.forEach(face => {
            [
                this.vertices[face.p1],
                this.vertices[face.p2],
                this.vertices[face.p3],
            ].forEach(v => {
                ["x", "y", "z"].forEach(axis => {
                    //@ts-ignore
                    if (v[axis] < min[axis])
                        min[axis] = v[axis];
                    //@ts-ignore
                    if (max[axis] < v[axis])
                        max[axis] = v[axis];
                });
            });
        });
        const w = max.x - min.x;
        const h = max.y - min.y;
        const uvs = [];
        this.vertices.forEach(v => {
            uvs.push(new Vec2((v.x - min.x) / w, (max.y - v.y) / h));
        });
        return uvs;
    }
    computeNormals() {
        this.normals = Geometry.computeNormals(this.indices, this.vertices);
    }
    computeUvs() {
        this.uvs = this._computeUvs();
    }
    // Real-Time 3D Grphics with WebGL 2: utils.js
    computeTangents() {
        const vs = this.vertices.map(v => v.toArray()).flat();
        const tc = this.uvs.map(uv => uv.toArray()).flat();
        const ind = this.indices.map(i => i.toArray()).flat();
        const tangents = [];
        for (let i = 0; i < vs.length / 3; i++) {
            tangents[i] = [0, 0, 0];
        }
        let a = [0, 0, 0], b = [0, 0, 0], triTangent = [0, 0, 0];
        for (let i = 0; i < ind.length; i += 3) {
            const i0 = ind[i];
            const i1 = ind[i + 1];
            const i2 = ind[i + 2];
            const pos0 = [vs[i0 * 3], vs[i0 * 3 + 1], vs[i0 * 3 + 2]];
            const pos1 = [vs[i1 * 3], vs[i1 * 3 + 1], vs[i1 * 3 + 2]];
            const pos2 = [vs[i2 * 3], vs[i2 * 3 + 1], vs[i2 * 3 + 2]];
            const tex0 = [tc[i0 * 2], tc[i0 * 2 + 1]];
            const tex1 = [tc[i1 * 2], tc[i1 * 2 + 1]];
            const tex2 = [tc[i2 * 2], tc[i2 * 2 + 1]];
            vec3.subtract(a, pos1, pos0);
            vec3.subtract(b, pos2, pos0);
            const c2c1b = tex1[1] - tex0[1];
            const c3c1b = tex2[0] - tex0[1];
            triTangent = [c3c1b * a[0] - c2c1b * b[0], c3c1b * a[1] - c2c1b * b[1], c3c1b * a[2] - c2c1b * b[2]];
            vec3.add(triTangent, tangents[i0], triTangent);
            vec3.add(triTangent, tangents[i1], triTangent);
            vec3.add(triTangent, tangents[i2], triTangent);
        }
        // Normalize tangents
        const ts = [];
        tangents.forEach(tan => {
            vec3.normalize(tan, tan);
            ts.push(tan[0]);
            ts.push(tan[1]);
            ts.push(tan[2]);
        });
        return ts;
    }
}
