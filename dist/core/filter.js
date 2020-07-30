import { Scene } from "./scene.js";
import { Material } from "./material.js";
import { PlaneGeometry } from "../geometry/planegeometry.js";
import { Mesh } from "../core/mesh.js";
import { RenderTarget } from "./rendertarget.js";
export class Filter {
    constructor(scene, material = new FilterMaterial()) {
        material.filter = this;
        if (typeof scene === "string") {
            const body = scene;
            scene = new FilterScene((frag, frame) => body);
        }
        this.scene = scene;
        this.plane = new PlaneGeometry(2, 2);
        this.planeMesh = new Mesh(this.plane, material);
        this.scene.add(this.planeMesh);
    }
    setupRenderTarget(parentRenderer) {
        this.renderer = parentRenderer.renew();
        this.renderer.prepareRender(this.scene);
        const { width, height } = this.renderer.container;
        this.inputRenderTarget = new RenderTarget(width, height);
        this.inputRenderTarget.setup(this.renderer.gl);
        this.outputRenderTarget = new RenderTarget(width, height); // default output (to screen)
        parentRenderer.use();
    }
    resetFrameBuffer() {
        if (!this.renderer)
            return;
        this.inputRenderTarget?.reset(this.renderer.gl);
    }
    draw() {
        this.renderer.render(this.scene, new FilterCamera());
    }
}
// do almost nothing
class FilterCamera {
    resetFilters() {
        // do nothing
    }
    applyFilters(renderer, fn) {
        fn();
    }
    setupGLMatrixes(renderer, scene) {
        // do nothing
    }
}
export class FilterChain {
    constructor() {
        this.filters = [];
    }
    push(filter) {
        if (0 < this.filters.length) {
            const lastFilter = this.filters[this.filters.length - 1];
            lastFilter.outputRenderTarget = filter.inputRenderTarget;
        }
        this.filters.push(filter);
    }
    forEach(fn) {
        this.filters.forEach(fn);
    }
    apply(parentRenderer, fn) {
        const gl = parentRenderer.gl;
        if (0 < this.filters.length) {
            this.filters[0].inputRenderTarget?.apply(gl);
        }
        fn();
        this.filters.forEach(filter => {
            filter.renderer.use();
            filter.outputRenderTarget.apply(gl);
            filter.draw();
        });
        parentRenderer.use();
    }
}
export class FilterMaterial extends Material {
    setColor(color) { }
    prepare(renderer, mesh) { }
    setupGLVars(renderer) {
        if (!this.filter)
            throw "no filter";
        //if (!this.filter.inputTexture)  throw "no inputTexture"
        const gl = renderer.gl;
        const samplerLocation = renderer.getUniformLocation("uSampler"); // TODO
        this.filter.inputRenderTarget?.setupGLVars(gl, samplerLocation);
    }
}
export class FilterScene extends Scene {
    constructor(fragmentShaderBodyFn) {
        super();
        this.fragmentShaderBodyFn = fragmentShaderBodyFn;
    }
    hasTexture() {
        return true;
    }
    // overridable
    getVertexPositionAttribLocation(renderer) {
        return renderer.getAttributeLocation("aVertexPosition");
    }
    getVertexNormalAttribLocation(renderer) {
        return -1;
    }
    getVertexColorAttribLocation(renderer) {
        return -1;
    }
    getVertexOffsetAttribLocation(renderer) {
        return -1;
    }
    getVertexQuatAttribLocation(renderer) {
        return -1;
    }
    getVertexTangentAttribLocation(renderer) {
        return -1;
    }
    // overridable
    getVertexTextureCoordsAttribLocation(renderer) {
        return renderer.getAttributeLocation("aVertexTextureCoords");
    }
    getProjectionMatrixUniformLocation(renderer) {
        return renderer.getUniformLocation("nerver called"); // TODO
    }
    getModelViewMatrixUniformLocation(renderer) {
        return renderer.getUniformLocation("nerver called"); // TODO
    }
    getNormalMatrixUniformLocation(renderer) {
        return renderer.getUniformLocation("nerver called"); // TODO
    }
    // overridable
    getAttributeNames() {
        return ["aVertexPosition", "aVertexTextureCoords"];
    }
    // overridable
    getUniformNames() {
        return ["uSampler"];
    }
    getVertexShader() {
        return `#version 300 es
      precision mediump float;

      in vec3 aVertexPosition;
      in vec2 aVertexTextureCoords;

      out vec2 vTextureCoords;

      void main(void) {
        vTextureCoords = aVertexTextureCoords;
        gl_Position = vec4(aVertexPosition, 1.0);
      }
    `;
    }
    getFragmentShader() {
        const body = this.getFragmentShaderBody("fragColor", "frameColor");
        return `${this.getFragmentShaderHead()}

      void main(void) {
        vec4 frameColor = texture(uSampler, vTextureCoords);
        ${this.getFragmentShaderBody("fragColor", "frameColor")}
      }
   `;
    }
    getFragmentShaderHead() {
        return `#version 300 es
      precision mediump float;

      uniform sampler2D uSampler;
      in vec2 vTextureCoords;
      out vec4 fragColor;
    `;
    }
    getFragmentShaderBody(fragColor, frameColor) {
        if (this.fragmentShaderBodyFn) {
            return this.fragmentShaderBodyFn(fragColor, frameColor);
        }
        throw "subclass responsibility";
    }
}
FilterScene.Material = FilterMaterial;
