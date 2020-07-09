import { Scene } from "./scene.js"
import { Camera } from "./camera.js"
import { Mesh } from "./mesh.js"

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

  clear(r: number = 0.0, g: number = 0.0, b: number = 0.0, a: number = 1.0) {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.gl.clearColor(r, g, b, a)
    this.gl.clearDepth(1.0)
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.depthFunc(this.gl.LEQUAL)
  }

  initGLBuffers(mesh: Mesh): {verticesBuffer:WebGLBuffer | null, indicesBuffer:WebGLBuffer | null, normalBuffer:WebGLBuffer | null} {
    const vao = this.gl.createVertexArray()
    if (vao === null) {
      throw "fail to create VAO"
    }
    this.vao = vao!
    this.gl.bindVertexArray(this.vao)

    const verticesBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, verticesBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.getVertices(), this.gl.STATIC_DRAW)
    const vertexPosition = mesh.material.attributeLocations.get("aVertexPosition")
    if (vertexPosition === undefined) {
      throw "fail to get attribute: aVertexPosition"
    }
    this.gl.enableVertexAttribArray(vertexPosition!)
    this.gl.vertexAttribPointer(vertexPosition!, 3, this.gl.FLOAT, false, 0, 0)

    const normalBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, mesh.getNormals(), this.gl.STATIC_DRAW)
    const normalPosition = mesh.material.attributeLocations.get("aVertexNormal")
    if (normalPosition === undefined) {
      throw "fail to get attribute: aVertexNormal"
    }
    this.gl.enableVertexAttribArray(normalPosition!)
    this.gl.vertexAttribPointer(normalPosition!, 3, this.gl.FLOAT, false, 0, 0)

    const indicesBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, mesh.getIndices(), this.gl.STATIC_DRAW)

    // clear
    this.gl.bindVertexArray(null)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)

    return { verticesBuffer, indicesBuffer, normalBuffer }
  }

  draw(mesh: Mesh, camera: Camera, indicesBuffer:WebGLBuffer) {
    // project
    const modelViewMatrixLocation = mesh.material.getUniformLocation("uModelViewMatrix")
    const projectionMatrixLocation = mesh.material.getUniformLocation("uProjectionMatrix")
    const normalMatrixLocation = mesh.material.getUniformLocation("uNormalMatrix")
    this.gl.uniformMatrix4fv(modelViewMatrixLocation, false, camera.modelViewMatrix)
    this.gl.uniformMatrix4fv(projectionMatrixLocation, false, camera.projectionMatrix)
    this.gl.uniformMatrix4fv(normalMatrixLocation, false, camera.normalMatrix)

    // light
    const lightDirectionLocation = mesh.material.getUniformLocation("uLightDirection")
    const lightAmbientLocation = mesh.material.getUniformLocation("uLightAmbient")
    const lightDiffuseLocation = mesh.material.getUniformLocation("uLightDiffuse")
    const materialDiffuseLocation = mesh.material.getUniformLocation("uMaterialDiffuse")
    this.gl.uniform3fv(lightDirectionLocation, [0, 0, -1])
    this.gl.uniform4fv(lightAmbientLocation, [0.3, 0.3, 0.3, 1])
    this.gl.uniform4fv(lightDiffuseLocation, [0.8, 0.8, 0.8, 1])
    this.gl.uniform4fv(materialDiffuseLocation, [0.1, 0.5, 1.0, 1])

    try {
      this.gl.bindVertexArray(this.vao!)

      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
      //this.gl.drawElements(this.gl.LINES, mesh.geometry.indices.length * 3, this.gl.UNSIGNED_SHORT, 0)
      this.gl.drawElements(this.gl.TRIANGLES, mesh.geometry.indices.length * 3, this.gl.UNSIGNED_SHORT, 0)

      this.gl.bindVertexArray(null)
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
    } catch (e) {
      console.error(e)
    }
  }

  render(scene: Scene, camera: Camera) {
    this.clear()

    scene.eachMesh(mesh => {
      mesh.material.setup(this.gl!)
      const { indicesBuffer } = this.initGLBuffers(mesh)
      this.draw(mesh, camera, indicesBuffer!)
    })
  }
}