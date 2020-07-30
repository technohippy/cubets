var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _starting;
import { Renderer } from "./renderer.js";
import { FilterChain } from "./filter.js";
import { Vec3 } from "../math/vec3.js";
import { Quat } from "../math/quat.js";
import { Viewport } from "./viewport.js";
import { Vec2 } from "../math/vec2.js";
//@ts-ignore
import { glMatrix, mat4, vec3 } from "../../node_modules/gl-matrix/esm/index.js";
glMatrix.setMatrixArrayType(Array);
export class Camera {
    constructor(viewport) {
        this.filters = new FilterChain();
        this.projectionMatrix = mat4.create();
        this.modelViewMatrix = mat4.create();
        this.normalMatrix = mat4.create();
        this.controls = [];
        this.position = new Vec3();
        this.rotation = new Quat();
        this.up = new Vec3(0, 1, 0);
        _starting.set(this, false);
        if (typeof viewport === "string") {
            viewport = new Viewport(new Vec2(), new Vec2(1, 1), viewport);
        }
        this.renderer = new Renderer(viewport);
    }
    getAspectRatio() {
        return this.renderer.getAspectRatio();
    }
    addControl(control) {
        this.controls.push(control);
    }
    setPicker(picker) {
        this.picker = picker;
    }
    removeControl(control) {
        this.controls.splice(this.controls.indexOf(control), 1);
        control.detachEvents();
    }
    followTarget(target) {
        this.target = target;
    }
    resetTarget() {
        this.target = undefined;
    }
    addFilter(filter) {
        filter.setupRenderTarget(this.renderer);
        this.filters.push(filter);
    }
    removeFilter(filter) {
        throw "not yet";
    }
    resetFilters() {
        this.filters.forEach(f => {
            f.resetFrameBuffer();
        });
    }
    applyFilters(renderer, fn) {
        this.filters.apply(renderer, fn);
    }
    setupGLMatrixes(renderer, scene) {
        const gl = renderer.gl;
        const projectionMatrixLocation = scene.getProjectionMatrixUniformLocation(renderer);
        const modelViewMatrixLocation = scene.getModelViewMatrixUniformLocation(renderer);
        const normalMatrixLocation = scene.getNormalMatrixUniformLocation(renderer);
        gl.uniformMatrix4fv(modelViewMatrixLocation, false, this.modelViewMatrix);
        gl.uniformMatrix4fv(projectionMatrixLocation, false, this.projectionMatrix);
        gl.uniformMatrix4fv(normalMatrixLocation, false, this.normalMatrix);
    }
    setupModelViewMatrix() {
        const translationMat = mat4.create();
        mat4.translate(translationMat, translationMat, this.position.toArray());
        const rotationMat = mat4.create();
        if (this.target) {
            // ignore this.rotation
            // https://webglfundamentals.org/webgl/lessons/ja/webgl-3d-camera.html
            const zAxis = vec3.subtract(vec3.create(), this.position.toArray(), this.target.toArray());
            const xAxis = vec3.cross(vec3.create(), this.up.toArray(), zAxis);
            const yAxis = vec3.cross(vec3.create(), zAxis, xAxis);
            vec3.normalize(xAxis, xAxis);
            vec3.normalize(yAxis, yAxis);
            vec3.normalize(zAxis, zAxis);
            mat4.copy(rotationMat, [
                xAxis[0], xAxis[1], xAxis[2], 0,
                yAxis[0], yAxis[1], yAxis[2], 0,
                zAxis[0], zAxis[1], zAxis[2], 0,
                this.position.x, this.position.y, this.position.z, 1,
            ]);
        }
        else {
            // ignore this.target
            mat4.fromQuat(rotationMat, this.rotation.toArray());
        }
        const cameraMatrix = mat4.create();
        mat4.multiply(cameraMatrix, cameraMatrix, translationMat);
        mat4.multiply(cameraMatrix, cameraMatrix, rotationMat);
        mat4.invert(this.modelViewMatrix, cameraMatrix);
        // K = (M^-1)^T
        // K:normal matrix
        // M:model-view matrix
        mat4.copy(this.normalMatrix, this.modelViewMatrix);
        mat4.invert(this.normalMatrix, this.normalMatrix);
        mat4.transpose(this.normalMatrix, this.normalMatrix);
    }
    draw(scene) {
        this.setupProjectionMatrix();
        this.setupModelViewMatrix();
        this.renderer.prepareRender(scene);
        this.renderer.render(scene, this);
    }
    async start(scene, loop = true) {
        if (__classPrivateFieldGet(this, _starting))
            return;
        await scene.loadAllTextures();
        if (this.picker) {
            this.picker.setup(this, scene);
        }
        this.controls.forEach(control => {
            if (!control.camera) {
                control.setCamera(this);
            }
        });
        if (loop)
            __classPrivateFieldSet(this, _starting, true);
        this._anim(scene);
    }
    startOnce(scene) {
        this.start(scene, false);
    }
    stop() {
        __classPrivateFieldSet(this, _starting, false);
    }
    _anim(scene) {
        this.draw(scene);
        if (__classPrivateFieldGet(this, _starting))
            requestAnimationFrame(() => this._anim(scene));
    }
}
_starting = new WeakMap();
