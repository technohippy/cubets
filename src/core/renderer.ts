import { Scene } from "./scene.js"
import { Camera } from "./camera.js"
import { Mesh } from "./mesh.js"
import { Light } from "./light.js"
import { PhongLight } from "./phong/phonglight.js"
import { PhongMaterial } from "./phong/phongmaterial.js"

export class Renderer {
  container: HTMLCanvasElement
  gl: WebGL2RenderingContext
  vao?: WebGLVertexArrayObject

  constructor(container?: HTMLCanvasElement | string) {
    if (!container) {
      container = document.createElement("canvas")
      container.setAttribute("height", "400")
      container.setAttribute("width", "600")
      document.body.append(container)
    } else if (typeof container === "string") {
      container = document.getElementById(container) as HTMLCanvasElement
    }
    this.container = container
    this.gl = this.container.getContext("webgl2") as WebGL2RenderingContext
  }

  render(scene: Scene, camera: Camera) {
    this.clear()

    const light = scene.lights[0]
    scene.eachMesh(mesh => {
      const { indicesBuffer } = this.setupVAO(scene, mesh)
      this.renderMesh(scene, mesh, light, camera, indicesBuffer!)
    })
  }

  clear(r: number = 0.0, g: number = 0.0, b: number = 0.0, a: number = 1.0) {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.gl.clearColor(r, g, b, a)
    this.gl.clearDepth(1.0)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.depthFunc(this.gl.LEQUAL)
  }

  setupVAO(scene: Scene, mesh: Mesh): {verticesBuffer:WebGLBuffer | null, indicesBuffer:WebGLBuffer | null, normalBuffer:WebGLBuffer | null} {
    const vao = this.gl.createVertexArray()
    if (vao === null) {
      throw "fail to create VAO"
    }
    this.vao = vao!
    this.gl.bindVertexArray(this.vao)

    const buffers = mesh.setupGLBuffers(this.gl, scene)

    // clear
    this.gl.bindVertexArray(null)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)

    return buffers
  }

  renderMesh(scene: Scene, mesh: Mesh, light_: Light, camera: Camera, indicesBuffer:WebGLBuffer) {
    const light = light_ as PhongLight
    const material = mesh.material as PhongMaterial
    
    camera.setupGLMatrixes(this.gl, scene)
    light.setupGLVars(this.gl, scene)
    material.setupGLVars(this.gl, scene)

    try {
      this.gl.bindVertexArray(this.vao!)

      mesh.drawGL(this.gl)

      this.gl.bindVertexArray(null)
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
    } catch (e) {
      console.error(e)
    }
  }
}