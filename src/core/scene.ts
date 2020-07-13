import { Mesh } from './mesh.js'
import { Light } from './light.js'
import { Renderer } from './renderer.js'

export abstract class Scene {
  vertexShader: string
  fragmentShader: string

  meshes: Mesh[] = []
  lights: Light[] = []

  constructor(vs: string, fs: string) {
    this.vertexShader = vs
    this.fragmentShader = fs
  }

  add(obj: Mesh | Light) {
    if (obj instanceof Mesh) {
      this.addMesh(obj)
    } else if (obj instanceof Light) {
      this.addLight(obj)
    }
  }

  addMesh(mesh: Mesh) {
    this.meshes.push(mesh)
  }

  addLight(light: Light) {
    this.lights.push(light)
  }

  each(fn: (obj: Mesh | Light) => void) {
    this.eachMesh(fn)
    this.eachLight(fn)
  }

  eachMesh(fn: (obj: Mesh) => void) {
    this.meshes.forEach(fn)
  }

  eachLight(fn: (obj: Light) => void) {
    this.lights.forEach(fn)
  }

  prepareShaders(renderer: Renderer) {
    const vs = renderer.gl.createShader(renderer.gl.VERTEX_SHADER)!
    renderer.gl.shaderSource(vs, this.vertexShader)
    renderer.gl.compileShader(vs)
    if (!renderer.gl.getShaderParameter(vs, renderer.gl.COMPILE_STATUS)) {
      console.error(renderer.gl.getShaderInfoLog(vs))
    }

    const fs = renderer.gl.createShader(renderer.gl.FRAGMENT_SHADER)!
    renderer.gl.shaderSource(fs, this.fragmentShader)
    renderer.gl.compileShader(fs)
    if (!renderer.gl.getShaderParameter(fs, renderer.gl.COMPILE_STATUS)) {
      console.error(renderer.gl.getShaderInfoLog(fs))
    }

    const program = renderer.gl.createProgram()!
    renderer.gl.attachShader(program, vs)
    renderer.gl.attachShader(program, fs)
    renderer.gl.linkProgram(program)
    if (!renderer.gl.getProgramParameter(program, renderer.gl.LINK_STATUS)) {
      throw("fail to initialize shaders")
    }
    renderer.gl.useProgram(program)

    this.getAttributeNames().forEach(attrName => {
      const loc = renderer.gl.getAttribLocation(program, attrName)
      if (loc < 0) {
        throw `fail to get attribute location: ${attrName}`
      }
      renderer.attributeLocations.set(attrName, loc)
    })

    this.getUniformNames().forEach(uniName => {
      const loc = renderer.gl.getUniformLocation(program!, uniName)
      if (loc === null) {
        throw `fail to get uniform location: ${uniName}`
      }
      renderer.uniformLocations.set(uniName, loc)
    })
    renderer.isLocationsPrepared = true
  }

  abstract getVertexPositionAttribLocation(renderer:Renderer): number
  abstract getVertexNormalAttribLocation(renderer:Renderer): number
  abstract getVertexTextureCoordsAttribLocation(renderer:Renderer): number

  abstract getProjectionMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation
  abstract getModelViewMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation
  abstract getNormalMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation

  abstract getAttributeNames(): string[]

  abstract getUniformNames(): string[]

}