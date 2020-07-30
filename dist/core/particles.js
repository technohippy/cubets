import { Mesh } from "./mesh.js";
export class Particles extends Mesh {
    setupGLBuffers(renderer, scene) {
        super.setupGLBuffers(renderer, scene);
        const gl = renderer.gl;
        const particlesLocation = renderer.getUniformLocation("uParticles");
        gl.uniform1i(particlesLocation, 1);
    }
    drawGL(gl) {
        gl.drawArrays(gl.POINTS, 0, this.geometry.vertices.length);
    }
}
