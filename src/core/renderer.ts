import { Scene } from "./scene.js"
import { FilteredCamera } from "./camera.js"
import { Mesh } from "./mesh.js"
import { Viewport } from "./viewport.js"
import { RGBAColor } from "../math/rgbacolor.js"

export class Renderer {
  container: HTMLCanvasElement
  viewport: Viewport
  gl: WebGL2RenderingContext
  vao?: WebGLVertexArrayObject

  program?: WebGLProgram
  attributeLocations = new Map<string, number>()
  uniformLocations = new Map<string, WebGLUniformLocation>()

  constructor(viewport:Viewport) {
    this.container = viewport.container
    this.gl = this.container.getContext("webgl2") as WebGL2RenderingContext
    this.viewport = viewport
  }

  renew(): Renderer {
    return new Renderer(this.viewport)
  }

  getAspectRatio(): number {
    return this.viewport.getAspectRatio()
  }

  prepareProgram(scene: Scene) {
    const vs = this.gl.createShader(this.gl.VERTEX_SHADER)!
    this.gl.shaderSource(vs, scene.getVertexShader())
    this.gl.compileShader(vs)
    if (!this.gl.getShaderParameter(vs, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(vs))
    }

    const fs = this.gl.createShader(this.gl.FRAGMENT_SHADER)!
    this.gl.shaderSource(fs, scene.getFragmentShader())
    this.gl.compileShader(fs)
    if (!this.gl.getShaderParameter(fs, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(fs))
    }

    this.program = this.gl.createProgram()!
    this.gl.attachShader(this.program, vs)
    this.gl.attachShader(this.program, fs)
    this.gl.linkProgram(this.program)
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error(this.gl.getProgramInfoLog(this.program))
      throw("fail to initialize shaders")
    }
  }

  setupLocations(scene: Scene) {
    scene.getAttributeNames().forEach(attrName => {
      const loc = this.gl.getAttribLocation(this.program!, attrName)
      if (loc < 0) {
        throw `fail to get attribute location: ${attrName}`
      }
      this.attributeLocations.set(attrName, loc)
    })

    scene.getUniformNames().forEach(uniName => {
      const loc = this.gl.getUniformLocation(this.program!, uniName)
      if (loc === null) {
        throw `fail to get uniform location: ${uniName}`
      }
      this.uniformLocations.set(uniName, loc)
    })
  }

  use() {
    this.gl.useProgram(this.program!)
  }

  render(scene: Scene, camera: FilteredCamera) {
    this.use()
    this.clear(scene.clearColor, camera)
    scene.eachMesh(mesh => {
      if (mesh.skipRender) return

      this.setupVAO(scene, mesh)
      this.renderMesh(scene, mesh, camera)
    })
  }

  clear(clearColor:RGBAColor=RGBAColor.Black, camera: FilteredCamera) {
    this.viewport.apply(this.gl)
    this.gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a)
    this.gl.clearDepth(1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.depthFunc(this.gl.LEQUAL)

    camera.resetFilters()
  }

  setupVAO(scene: Scene, mesh: Mesh) {
    if (!this.vao) {
      const vao = this.gl.createVertexArray()
      if (vao === null) {
        throw "fail to create VAO"
      }
      this.vao = vao!
    }

    this.gl.bindVertexArray(this.vao)

    mesh.setupGLBuffers(this, scene)

    // clear
    this.gl.bindVertexArray(null)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
  }

  renderMesh(scene: Scene, mesh: Mesh, camera: FilteredCamera) {
    camera.setupGLMatrixes(this, scene)
    scene.lights.setupGLVars(this)
    mesh.material.setupGLVars(this, mesh)

    try {
      this.gl.bindVertexArray(this.vao!)

      camera.applyFilters(this, () => {
        mesh.drawGL(this.gl)
      })
      this.gl.bindVertexArray(null)
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
    } catch (err) {
      console.error(err)
    }
  }

  getAttributeLocation(name: string, ignoreError: boolean = false): number {
    const loc = this.attributeLocations.get(name)
    if (loc === undefined) {
      if (ignoreError) return -1
      throw `attribute not found: ${name}`
    }
    return loc!
  }

  getUniformLocation(name: string, ignoreError: boolean = false): WebGLUniformLocation | null {
    const loc = this.uniformLocations.get(name)
    if (loc === undefined) {
      if (ignoreError) return null
      throw `uniform not found: ${name}`
    }
    return loc as WebGLUniformLocation
  }
}