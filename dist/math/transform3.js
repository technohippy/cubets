var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _mat;
import { Vec3 } from "./vec3.js";
//@ts-ignore
import { glMatrix, mat4, vec3 } from "../../node_modules/gl-matrix/esm/index.js";
glMatrix.setMatrixArrayType(Array);
export class Transform3 {
    constructor(mat = mat4.create()) {
        _mat.set(this, void 0);
        __classPrivateFieldSet(this, _mat, mat);
    }
    clone() {
        return new Transform3(mat4.clone(__classPrivateFieldGet(this, _mat)));
    }
    static translate(amount) {
        return new Transform3().translate(amount);
    }
    static rotate(rad, axis) {
        return new Transform3().rotate(rad, axis);
    }
    static scale(scales) {
        return new Transform3().scale(scales);
    }
    static scaleScalar(scale) {
        return new Transform3().scaleScalar(scale);
    }
    translate(amount) {
        mat4.fromTranslation(__classPrivateFieldGet(this, _mat), amount.toArray());
        return this;
    }
    rotate(rad, axis) {
        mat4.fromRotation(__classPrivateFieldGet(this, _mat), rad, axis.toArray());
        return this;
    }
    scale(scales) {
        mat4.fromScaling(__classPrivateFieldGet(this, _mat), scales.toArray());
        return this;
    }
    scaleScalar(scale) {
        return this.scale(new Vec3(scale, scale, scale));
    }
    multiply(that) {
        mat4.mul(__classPrivateFieldGet(this, _mat), __classPrivateFieldGet(this, _mat), __classPrivateFieldGet(that, _mat));
        return this;
    }
    apply(vec) {
        vec.asArray(v => {
            return vec3.transformMat4(v, v, __classPrivateFieldGet(this, _mat));
        });
    }
}
_mat = new WeakMap();
