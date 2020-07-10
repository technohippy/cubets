import { Mesh } from './mesh.js'
import { Light } from './light.js'
import { Renderer } from './renderer.js'

export abstract class Scene {
  vertexShader: string
  fragmentShader: string
  attributeLocations = new Map<string, number>()
  uniformLocations = new Map<string, WebGLUniformLocation>()
  prepared: boolean = false

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
      this.attributeLocations.set(attrName, loc)
    })

    this.getUniformNames().forEach(uniName => {
      const loc = renderer.gl.getUniformLocation(program!, uniName)
      if (loc === null) {
        throw `fail to get uniform location: ${uniName}`
      }
      this.uniformLocations.set(uniName, loc)
    })

    this.prepared = true
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

  abstract getVertexPositionAttribLocation(): number;
  abstract getVertexNormalAttribLocation(): number;

  abstract getProjectionMatrixUniformLocation(): WebGLUniformLocation;
  abstract getModelViewMatrixUniformLocation(): WebGLUniformLocation;
  abstract getNormalMatrixUniformLocation(): WebGLUniformLocation;

  abstract getAttributeNames(): string[];

  abstract getUniformNames(): string[];

}