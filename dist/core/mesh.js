import { Transform3 } from "../math/transform3.js";
import { Vec3 } from "../math/vec3.js";
import { Quat } from "../math/quat.js";
export class Mesh {
    constructor(geometry, material) {
        this.hidden = false;
        this.children = [];
        this.localPosition = new Vec3(); // relative position from the parent mesh
        this.position = new Vec3();
        this.rotation = new Quat();
        this.transforms = [];
        this.basePosition = new Vec3(); // center of rotation
        this.id = Mesh.currentId;
        Mesh.currentId += 1;
        if (0xffffff < Mesh.currentId) {
            console.warn(`mesh id overflow: ${Mesh.currentId}`);
        }
        this.geometry = geometry;
        this.material = material;
    }
    add(mesh, localPosition = new Vec3()) {
        mesh.localPosition = localPosition;
        this.children.push(mesh);
        mesh.parent = this;
    }
    forEachChild(fn) {
        this.children.forEach(childMesh => {
            childMesh.forEachChild(child => {
                fn(child);
            });
            fn(childMesh);
        });
    }
    getTransform() {
        const parentTransform = this.parent ? this.parent.getTransform() : new Transform3();
        const localPositionTransform = Transform3.translate(this.localPosition);
        const basePositionTransform = Transform3.translate(this.basePosition.clone().negate());
        const positionTransform = Transform3.translate(this.position);
        const rotationTransform = this.rotation.toTransform();
        const transform = parentTransform;
        transform.multiply(localPositionTransform);
        for (let i = this.transforms.length - 1; 0 <= i; i--) {
            transform.multiply(this.transforms[i]);
        }
        transform.multiply(positionTransform);
        transform.multiply(rotationTransform);
        transform.multiply(basePositionTransform);
        return transform;
    }
    translate(amount) {
        this.transforms.push(Transform3.translate(amount));
    }
    rotate(rad, axis) {
        this.transforms.push(Transform3.rotate(rad, axis));
    }
    scale(scale) {
        this.transforms.push(Transform3.scaleScalar(scale));
    }
    resetTransform() {
        this.transforms.length = 0;
    }
    hasTexture() {
        return 0 < this.material.textures.length;
    }
    hasCubeTexture() {
        return !!this.material.cubeTexture;
    }
    setupGLBuffers(renderer, scene, ignoreTransform = false) {
        const gl = renderer.gl;
        this._concentrateMatrixes();
        let transformedVertices;
        if (ignoreTransform) {
            transformedVertices = this.geometry.vertices;
        }
        else {
            transformedVertices = this.geometry.transformVertices(this.getTransform());
        }
        const vertexLocation = scene.getVertexPositionAttribLocation(renderer);
        if (0 <= vertexLocation) {
            this.verticesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.geometry.getVertices(transformedVertices), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(vertexLocation);
            gl.vertexAttribPointer(vertexLocation, 3, gl.FLOAT, false, 0, 0);
        }
        const normalLocation = scene.getVertexNormalAttribLocation(renderer);
        if (0 <= normalLocation) {
            this.normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.geometry.getNormals(transformedVertices), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(normalLocation);
            gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
        }
        const colorLocation = scene.getVertexColorAttribLocation(renderer);
        if (0 <= colorLocation) {
            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.geometry.getColors(), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(colorLocation);
            gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
        }
        const tangentLocation = scene.getVertexTangentAttribLocation(renderer);
        if (0 <= tangentLocation) {
            this.tangentBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry.computeTangents()), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(colorLocation);
            gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
        }
        if (scene.hasTexture() || scene.hasNormalTexture()) {
            const textureCoordsLocation = scene.getVertexTextureCoordsAttribLocation(renderer);
            this.textureCoordsBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.geometry.getTextureCoords(), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(textureCoordsLocation);
            gl.vertexAttribPointer(textureCoordsLocation, 2, gl.FLOAT, false, 0, 0);
        }
        this.indicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.geometry.getIndices(this.material.wireframe), gl.STATIC_DRAW);
    }
    drawGL(gl) {
        if (this.indicesBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
            if (this.material.wireframe) {
                gl.drawElements(gl.LINES, this.geometry.indices.length * 3 * 2, gl.UNSIGNED_SHORT, 0);
            }
            else {
                gl.drawElements(gl.TRIANGLES, this.geometry.indices.length * 3, gl.UNSIGNED_SHORT, 0);
            }
        }
    }
    _concentrateMatrixes() {
        const concentration = this.transforms.pop();
        if (concentration) {
            this.transforms.reverse().forEach(t => concentration?.multiply(t));
            this.transforms.length = 0;
            this.transforms.push(concentration);
        }
    }
}
Mesh.currentId = 1; // 0 is used for background.
