import { Mesh } from "./mesh.js";
import { Renderer } from "./renderer.js";
import { Scene } from "./scene.js";

export class Particles extends Mesh {
  setupGLBuffers(renderer:Renderer, scene:Scene) {
    super.setupGLBuffers(renderer, scene)

    const gl = renderer.gl
    const particlesLocation = renderer.getUniformLocation("uParticles")
    gl.uniform1i(particlesLocation, 1)
  }

  drawGL(gl: WebGL2RenderingContext) {
    gl.drawArrays(gl.POINTS, 0, this.geometry.vertices.length)
  }
}