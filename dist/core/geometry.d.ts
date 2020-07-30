import { Vec2 } from '../math/vec2.js';
import { Vec3 } from '../math/vec3.js';
import { Face3 } from '../math/face3.js';
import { Transform3 } from '../math/transform3.js';
import { RGBAColor } from '../math/rgbacolor.js';
export declare class Geometry {
    vertices: Vec3[];
    indices: Face3[];
    normals: Vec3[];
    uvs: Vec2[];
    colors: RGBAColor[];
    getVertices(transformedVertices: Vec3[]): Float32Array;
    getNormals(transformedVertices: Vec3[]): Float32Array;
    getTextureCoords(): Float32Array;
    getIndices(wireframe: boolean): Uint16Array;
    hasVertexColors(): boolean;
    getColors(): Float32Array;
    transformVertices(transform: Transform3): Vec3[];
    static computeNormals(indices: Face3[], vertices: Vec3[]): Vec3[];
    protected _computeUvs(): Vec2[];
    computeNormals(): void;
    computeUvs(): void;
    computeTangents(): number[];
}
//# sourceMappingURL=geometry.d.ts.map