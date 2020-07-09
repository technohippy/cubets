import { Scene } from "./scene.js"
import { Camera } from "./camera.js"
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
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
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

    // project
    const modelViewMatrixLocation = mesh.material.getUniformLocation("uModelViewMatrix")
    const projectionMatrixLocation = mesh.material.getUniformLocation("uProjectionMatrix")
    const normalMatrixLocation = mesh.material.getUniformLocation("uNormalMatrix")
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, camera.modelViewMatrix)
    gl.uniformMatrix4fv(projectionMatrixLocation, false, camera.projectionMatrix)
    gl.uniformMatrix4fv(normalMatrixLocation, false, camera.normalMatrix)

    // light
    const lightDirectionLocation = mesh.material.getUniformLocation("uLightDirection")
    const lightAmbientLocation = mesh.material.getUniformLocation("uLightAmbient")
    const lightDiffuseLocation = mesh.material.getUniformLocation("uLightDiffuse")
    const materialDiffuseLocation = mesh.material.getUniformLocation("uMaterialDiffuse")
    gl.uniform3fv(lightDirectionLocation, [0, 0, -1])
    gl.uniform4fv(lightAmbientLocation, [0.3, 0.3, 0.3, 1])
    gl.uniform4fv(lightDiffuseLocation, [0.8, 0.8, 0.8, 1])
    gl.uniform4fv(materialDiffuseLocation, [0.1, 0.5, 1.0, 1])

    try {
      gl.bindVertexArray(this.vao!)

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
      //gl.drawElements(gl.LINES, mesh.geometry.indices.length, gl.UNSIGNED_SHORT, 0)
      gl.drawElements(gl.TRIANGLES, mesh.geometry.indices.length, gl.UNSIGNED_SHORT, 0)

      gl.bindVertexArray(null)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    } catch (e) {
      console.error(e)
    }
  }

  render(scene: Scene, camera: Camera) {
    this.setupGLContext()

    scene.eachMesh(mesh => {
      mesh.material.setup(this.gl!)
      const { indicesBuffer } = this.initGLBuffers(mesh)
      this.draw(mesh, camera, indicesBuffer!)
    })
  }
}