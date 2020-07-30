import { RGBAColor } from "../math/rgbacolor.js";
import { RenderTarget } from "./rendertarget.js";
export class Renderer {
    constructor(viewport) {
        this.attributeLocations = new Map();
        this.uniformLocations = new Map();
        this.container = viewport.container;
        this.gl = this.container?.getContext("webgl2");
        this.viewport = viewport;
        this.renderTarget = new RenderTarget(this.viewport.size.x, this.viewport.size.y); // to screen
    }
    renew() {
        return new Renderer(this.viewport);
    }
    copyGLCachesFrom(renderer) {
        this.gl = renderer.gl;
        this.vao = renderer.vao;
        this.program = renderer.program;
        this.attributeLocations = renderer.attributeLocations;
        this.uniformLocations = renderer.uniformLocations;
    }
    getAspectRatio() {
        return this.viewport.getAspectRatio();
    }
    prepareProgram(scene) {
        const vs = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vs, scene.getVertexShader());
        this.gl.compileShader(vs);
        if (!this.gl.getShaderParameter(vs, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(vs));
        }
        const fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fs, scene.getFragmentShader());
        this.gl.compileShader(fs);
        if (!this.gl.getShaderParameter(fs, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(fs));
        }
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vs);
        this.gl.attachShader(this.program, fs);
        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error(this.gl.getProgramInfoLog(this.program));
            throw ("fail to initialize shaders");
        }
    }
    setupLocations(scene) {
        scene.getAttributeNames().forEach(attrName => {
            const loc = this.gl.getAttribLocation(this.program, attrName);
            if (loc < 0) {
                throw `fail to get attribute location: ${attrName}`;
            }
            this.attributeLocations.set(attrName, loc);
        });
        scene.getUniformNames().forEach(uniName => {
            const loc = this.gl.getUniformLocation(this.program, uniName);
            if (loc === null) {
                throw `fail to get uniform location: ${uniName}`;
            }
            this.uniformLocations.set(uniName, loc);
        });
    }
    use() {
        this.gl.useProgram(this.program);
    }
    prepareRender(scene) {
        if (!this.program) {
            this.prepareProgram(scene);
            this.use();
            this.setupLocations(scene);
        }
        if (!this.overrideMaterial) {
            this.prepareMeshMaterial(scene);
        }
    }
    prepareMeshMaterial(scene) {
        scene.eachMesh(mesh => {
            if (!mesh.material.skipPrepare) {
                mesh.material.prepare(this, mesh);
            }
        });
    }
    render(scene, camera) {
        this.use();
        this.clear(scene.clearColor, camera);
        if (scene.fog) {
            scene.fog.setupGLVars(this);
        }
        scene.eachMesh(mesh => {
            if (mesh.hidden)
                return;
            this.setupVAO(scene, mesh);
            this.renderMesh(scene, mesh, camera);
        });
    }
    clear(clearColor = RGBAColor.Black, camera) {
        this.viewport.apply(this.gl);
        this.gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
        this.gl.clearDepth(1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        camera.resetFilters();
    }
    setupVAO(scene, mesh) {
        if (!this.vao) {
            const vao = this.gl.createVertexArray();
            if (vao === null) {
                throw "fail to create VAO";
            }
            this.vao = vao;
        }
        this.gl.bindVertexArray(this.vao);
        mesh.setupGLBuffers(this, scene);
        // clear
        this.gl.bindVertexArray(null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
    renderMesh(scene, mesh, camera) {
        camera.setupGLMatrixes(this, scene);
        scene.lights.setupGLVars(this);
        if (this.overrideMaterial) {
            this.overrideMaterial.setupGLVars(this, mesh);
        }
        else {
            mesh.material.setupGLVars(this, mesh);
        }
        try {
            this.gl.bindVertexArray(this.vao);
            camera.applyFilters(this, () => {
                mesh.drawGL(this.gl);
            });
            this.gl.bindVertexArray(null);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        }
        catch (err) {
            console.error(err);
        }
    }
    getAttributeLocation(name, ignoreError = false) {
        const loc = this.attributeLocations.get(name);
        if (loc === undefined) {
            if (ignoreError)
                return -1;
            throw `attribute not found: ${name}`;
        }
        return loc;
    }
    getUniformLocation(name, ignoreError = false) {
        const loc = this.uniformLocations.get(name);
        if (loc === undefined) {
            if (ignoreError)
                return null;
            throw `uniform not found: ${name}`;
        }
        return loc;
    }
}
