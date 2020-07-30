import { PolarCoord } from "./polarcoord.js";
//@ts-ignore
import { glMatrix, mat4, vec3 } from "../../node_modules/gl-matrix/esm/index.js";
glMatrix.setMatrixArrayType(Array);
export class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    clone() {
        return new Vec3(this.x, this.y, this.z);
    }
    translate(amount) {
        this.asArray((vals) => {
            return vec3.add(vals, vals, amount);
        });
    }
    rotate(rad, axis) {
        this.asArray((vals) => {
            const rotMat = mat4.fromRotation(mat4.create(), rad, axis.toArray());
            return vec3.transformMat4(vec3.create(), vals, rotMat);
        });
    }
    cross(vec) {
        return new Vec3(...vec3.cross(vec3.create(), this.toArray(), vec.toArray()));
    }
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        return this;
    }
    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        return this;
    }
    multiplyScalar(val) {
        this.x *= val;
        this.y *= val;
        this.z *= val;
        return this;
    }
    divideScalar(val) {
        this.x /= val;
        this.y /= val;
        this.z /= val;
        return this;
    }
    negate() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    distance(that) {
        return this.clone().subtract(that).length();
    }
    normalize() {
        return this.divideScalar(this.length());
    }
    angleTo(v) {
        return vec3.angle(this.toArray(), v.toArray());
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    fromArray(values) {
        [this.x, this.y, this.z] = values;
    }
    asArray(fn) {
        this.fromArray(fn(this.toArray()));
    }
    toPolar() {
        const r = this.length();
        const theta = Math.acos(this.y / r);
        const phai = Math.atan(this.z / (this.x + 0.00001));
        return new PolarCoord(r, theta, phai);
    }
    fromPolar(polar) {
        return this.copy(polar.toVec3());
    }
}
