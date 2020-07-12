import { Scene } from "./scene.js"
import { Camera } from "./camera.js"
import { Mesh } from "./mesh.js"
import { Light } from "./light.js"
import { PhongLight } from "./phong/phonglight.js"
import { PhongMaterial } from "./phong/phongmaterial.js"
import { Viewport } from "./viewport.js"

export class Renderer {
  container: HTMLCanvasElement
  viewport: Viewport
  gl: WebGL2RenderingContext
  vao?: WebGLVertexArrayObject

  isLocationsPrepared = false
  attributeLocations = new Map<string, number>()
  uniformLocations = new Map<string, WebGLUniformLocation>()

  constructor(viewport:Viewport) {
    this.container = viewport.container
    this.gl = this.container.getContext("webgl2") as WebGL2RenderingContext
    this.viewport = viewport
  }

  getAspectRatio(): number {
    return this.viewport.getAspectRatio()
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
    this.viewport.apply(this.gl)
    this.gl.clearColor(r, g, b, a)
    this.gl.clearDepth(1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
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

    const buffers = mesh.setupGLBuffers(this, scene)

    // clear
    this.gl.bindVertexArray(null)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)

    return buffers
  }

  renderMesh(scene: Scene, mesh: Mesh, light_: Light, camera: Camera, indicesBuffer:WebGLBuffer) {
    const light = light_ as PhongLight
    const material = mesh.material as PhongMaterial
    
    camera.setupGLMatrixes(this, scene)
    light.setupGLVars(this)
    material.setupGLVars(this)

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

  getAttributeLocation(name: string): number {
    const loc = this.attributeLocations.get(name)
    if (loc === undefined) {
      throw `attribute not found: ${name}`
    }
    return loc!
  }

  getUniformLocation(name: string): WebGLUniformLocation {
    const loc = this.uniformLocations.get(name)
    if (loc === undefined) {
      throw `uniform not found: ${name}`
    }
    return loc as WebGLUniformLocation
  }
}