import { Mesh } from "./mesh.js";
import { Vec3 } from "../math/vec3.js";
export class InstancedMesh extends Mesh {
    constructor(instanceCount, geometry, material) {
        super(geometry, material); // TODO: 不要
        this.meshes = [];
        for (let i = 0; i < instanceCount; i++) {
            this.meshes.push(new Mesh(geometry, material));
        }
    }
    add(mesh, localPosition = new Vec3()) {
        throw "not implemented";
    }
    forEachChild(fn) {
        throw "not implemented";
    }
    getTransform() {
        throw "not implemented";
    }
    translate(amount) {
        throw "not implemented";
    }
    rotate(rad, axis) {
        throw "not implemented";
    }
    scale(scale) {
        throw "not implemented";
    }
    resetTransform() {
        throw "not implemented";
    }
    hasTexture() {
        return 0 < this.meshes[0].material.textures.length;
    }
    hasCubeTexture() {
        return !!this.meshes[0].material.cubeTexture;
    }
    setupGLBuffers(renderer, scene) {
        // TODO
    }
    drawGL(gl) {
        // TODO
    }
}
