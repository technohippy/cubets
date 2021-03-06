import { Scene } from "./scene.js"
import { FilteredCamera } from "./camera.js"
import { Mesh } from "./mesh.js"
import { Viewport } from "./viewport.js"
import { RGBAColor } from "../math/rgbacolor.js"
import { Transform3 } from "../math/transform3.js"
import { Material } from "./material.js"
import { RenderTarget } from "./rendertarget.js"

/** @internal */
export class Renderer {
  container?: HTMLCanvasElement
  viewport: Viewport
  gl: WebGL2RenderingContext
  vao?: WebGLVertexArrayObject

  renderTarget: RenderTarget

  program?: WebGLProgram
  attributeLocations = new Map<string, number>()
  uniformLocations = new Map<string, WebGLUniformLocation>()

  overrideMaterial?: Material

  constructor(viewport:Viewport) {
    this.container = viewport.container
    this.gl = this.container?.getContext("webgl2") as WebGL2RenderingContext
    this.viewport = viewport
    this.renderTarget = new RenderTarget(this.viewport.size.x, this.viewport.size.y) // to screen
  }

  renew(): Renderer {
    return new Renderer(this.viewport)
  }

  copyGLCachesFrom(renderer:Renderer) {
    this.gl = renderer.gl
    this.vao = renderer.vao
    this.program = renderer.program
    this.attributeLocations = renderer.attributeLocations
    this.uniformLocations = renderer.uniformLocations
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
      if (0 <= loc) {
        this.attributeLocations.set(attrName, loc)
      } else {
        console.warn(`fail to set attribute location: ${attrName}`)
      }
    })

    scene.getUniformNames().forEach(uniName => {
      const loc = this.gl.getUniformLocation(this.program!, uniName)
      if (loc !== null) {
        this.uniformLocations.set(uniName, loc)
      } else {
        console.warn(`fail to set uniform location: ${uniName}`)
      }
    })
  }

  use() {
    this.gl.useProgram(this.program!)
  }

  prepareRender(scene:Scene) {
    if (!this.program) {
      this.prepareProgram(scene)
      this.use()
      this.setupLocations(scene)
    }
    if (!this.overrideMaterial) {
      this.prepareMeshMaterial(scene)
    }
  }

  prepareMeshMaterial(scene:Scene) {
    scene.eachMesh(mesh => {
      if (!mesh.material.skipPrepare) {
        mesh.material.prepare(this, mesh)
      }
    })
  }

  render(scene: Scene, camera: FilteredCamera) {
    this.use()
    this.clear(scene.clearColor, camera)
    if (scene.fog) {
      scene.fog.setupGLVars(this)
    }
    scene.eachMesh(mesh => {
      if (mesh.hidden) return

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
    if (this.overrideMaterial) {
      this.overrideMaterial.setupGLVars(this, mesh)
    } else {
      mesh.material.setupGLVars(this, mesh)
    }

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
    let loc: WebGLUniformLocation | undefined | null = this.uniformLocations.get(name)
    if (loc === undefined) {
      loc = this.gl.getUniformLocation(this.program!, name)
      if (loc === null) {
        if (ignoreError) {
          return null
        } else {
          throw `fail to get uniform location: ${name}`
        }
      }
      this.uniformLocations.set(name, loc)
    }
    return loc as WebGLUniformLocation
  }
}