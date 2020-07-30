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
    get(i) {
        return this.meshes[i];
    }
    add(mesh, localPosition = new Vec3()) {
        throw "not implemented: add";
    }
    forEachChild(fn) {
        //throw "not implemented: forEachChild"
    }
    getTransform() {
        throw "not implemented: getTansform";
    }
    translate(amount) {
        throw "not implemented: translate";
    }
    rotate(rad, axis) {
        throw "not implemented: rotate";
    }
    scale(scale) {
        throw "not implemented: scale";
    }
    resetTransform() {
        throw "not implemented: resetTransform";
    }
    hasTexture() {
        return 0 < this.meshes[0].material.textures.length;
    }
    hasCubeTexture() {
        return !!this.meshes[0].material.cubeTexture;
    }
    setupGLBuffers(renderer, scene) {
        const gl = renderer.gl;
        const firstMesh = this.meshes[0];
        firstMesh.setupGLBuffers(renderer, scene, true);
        const offsetData = [];
        const quatData = [];
        this.meshes.forEach(mesh => {
            offsetData.push(...mesh.position.toArray());
            quatData.push(...mesh.rotation.toArray());
        });
        const offsetLocation = scene.getVertexOffsetAttribLocation(renderer);
        if (0 <= offsetLocation) {
            const offsetBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(offsetData), gl.DYNAMIC_DRAW);
            gl.enableVertexAttribArray(offsetLocation);
            gl.vertexAttribPointer(offsetLocation, 3, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(offsetLocation, 1);
        }
        const quatLocation = scene.getVertexQuatAttribLocation(renderer);
        if (0 <= quatLocation) {
            const quatBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, quatBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quatData), gl.DYNAMIC_DRAW);
            gl.enableVertexAttribArray(quatLocation);
            gl.vertexAttribPointer(quatLocation, 4, gl.FLOAT, false, 0, 0);
            gl.vertexAttribDivisor(quatLocation, 1);
        }
    }
    drawGL(gl) {
        gl.drawElementsInstanced(gl.TRIANGLES, this.geometry.indices.length * 3, gl.UNSIGNED_SHORT, 0, this.meshes.length);
    }
}
