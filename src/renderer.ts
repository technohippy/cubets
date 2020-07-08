import { Scene } from "./scene.js"
import { Camera } from "./camera.js"
import { glMatrix, mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } from "../node_modules/gl-matrix/esm/index.js"
import { Mesh } from "./mesh.js"

export class Renderer {
  container: HTMLCanvasElement
  gl?: WebGL2RenderingContext
  vao?: WebGLVertexArrayObject

  constructor(container?: HTMLCanvasElement | string) {
    if (!container) {
      container = document.createElement("canvas")
      container.setAttribute("height", "400")
      container.setAttribute("width", "600")
      document.body.append(container)
    }
    this.container = this.setContainer(container)
  }

  setContainer(container: HTMLCanvasElement | string): HTMLCanvasElement {
    if (typeof container === "string") {
      container = document.getElementById(container) as HTMLCanvasElement
    }
    this.container = container
    return this.container
  }

  setupGLContext() {
    this.gl = this.container.getContext("webgl2") as WebGL2RenderingContext
    this.clearGL()
  }

  clearGL(r: number = 0.0, g: number = 0.0, b: number = 0.0, a: number = 1.0) {
    const gl = this.gl!
    gl.clearColor(r, g, b, a)
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
  }

  initGLBuffers(mesh: Mesh): {verticesBuffer:WebGLBuffer | null, indicesBuffer:WebGLBuffer | null, normalBuffer:WebGLBuffer | null} {
    const gl = this.gl!
    const vao = gl.createVertexArray()
    if (vao === null) {
      throw "fail to create VAO"
    }
    this.vao = vao!
    gl.bindVertexArray(this.vao)

    const verticesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, mesh.getVertices(), gl.STATIC_DRAW)
    console.log(mesh.getVertices())
    const vertexPosition = mesh.material.attributeLocations.get("aVertexPosition")
    if (vertexPosition === undefined) {
      throw "fail to get attribute: aVertexPosition"
    }
    gl.enableVertexAttribArray(vertexPosition!)
    gl.vertexAttribPointer(vertexPosition!, 3, gl.FLOAT, false, 0, 0)

    const normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, mesh.getNormals(), gl.STATIC_DRAW)
    const normalPosition = mesh.material.attributeLocations.get("aVertexNormal")
    if (normalPosition === undefined) {
      throw "fail to get attribute: aVertexNormal"
    }
    gl.enableVertexAttribArray(normalPosition!)
    gl.vertexAttribPointer(normalPosition!, 3, gl.FLOAT, false, 0, 0)

    const indicesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.getIndices(), gl.STATIC_DRAW)

    // clear
    gl.bindVertexArray(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    return { verticesBuffer, indicesBuffer, normalBuffer }
  }

  draw(mesh: Mesh, camera: Camera, indicesBuffer:WebGLBuffer) {
    const gl = this.gl!
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const modelViewMatrixLocation = mesh.material.uniformLocations.get("uModelViewMatrix")
    if (modelViewMatrixLocation === undefined) {
      throw "fail to get uniform: uModelViewMatrix"
    }
    const projectionMatrixLocation = mesh.material.uniformLocations.get("uProjectionMatrix")
    if (projectionMatrixLocation === undefined) {
      throw "fail to get uniform: uProjectionMatrix"
    }
    const normalMatrixLocation = mesh.material.uniformLocations.get("uNormalMatrix")
    if (normalMatrixLocation === undefined) {
      throw "fail to get uniform: uNormalMatrix"
    }
    gl.uniformMatrix4fv(modelViewMatrixLocation!, false, camera.modelViewMatrix)
    gl.uniformMatrix4fv(projectionMatrixLocation!, false, camera.projectionMatrix)
    gl.uniformMatrix4fv(normalMatrixLocation!, false, camera.normalMatrix)

    try {
      gl.bindVertexArray(this.vao!)

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
      gl.drawElements(gl.LINES, mesh.geometry.indices.length, gl.UNSIGNED_SHORT, 0)
      //gl.drawElements(gl.TRIANGLES, mesh.geometry.indices.length, gl.UNSIGNED_SHORT, 0)

      gl.bindVertexArray(null)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    } catch (e) {
      console.error(e)
    }
    //requestAnimationFrame(() => {this.draw(mesh, camera, indicesBuffer)})
  }

  render(scene: Scene, camera: Camera) {
    scene.eachMesh(mesh => {
      const { indicesBuffer } = this.initGLBuffers(mesh)
      this.draw(mesh, camera, indicesBuffer!)
    })
    console.log("rendered")
  }
}