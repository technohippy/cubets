import { Vec2 } from "../math/vec2.js";
import { Vec3 } from "../math/vec3.js";
import { Face3 } from "../math/face3.js";
import { RGBAColor } from "../math/rgbacolor.js";
import { GLContext } from "../gl/glcontext.js";
import { GLAttribute } from "../gl/glattribute.js";
import { GLBuffer } from "../gl/glbuffer.js"
import { ToArray } from "../misc/toarray.js";

type GeometryConfigKey = "vertices" | "indices" | "normals" | "uvs" | "colors"
export type GeometryConfig = {[key in GeometryConfigKey]?:GLAttribute}

export class Geometry {
  indices:Face3[] = []
  vertices:Vec3[] = []

  normals:Vec3[] = []
  uvs:Vec2[] = []
  colors:RGBAColor[] = []

  verticesAttr?:GLAttribute
  indicesAttr?:GLAttribute
  normalsAttr?:GLAttribute
  uvsAttr?:GLAttribute
  colorsAttr?:GLAttribute

  #configured = false
  #uploaded = false

  setConfig(config:GeometryConfig) {
    this.verticesAttr = config["vertices"]
    this.indicesAttr = config["indices"]
    this.normalsAttr = config["normals"]
    this.uvsAttr = config["uvs"]
    this.colorsAttr = config["colors"]
    this.#configured = true
  }

  writeContext(context:GLContext) {
    if (this.#uploaded) {
      if (0 < this.vertices.length) {
        this.verticesAttr?.updateBufferData(this.toArray(this.vertices))
      }
      if (0 < this.indices.length) {
        this.indicesAttr?.updateBufferData(this.toArray(this.indices))
      }
      if (0 < this.normals.length) {
        this.normalsAttr?.updateBufferData(this.toArray(this.normals))
      }
      if (0 < this.uvs.length) {
        this.uvsAttr?.updateBufferData(this.toArray(this.uvs))
      }
      if (0 < this.colors.length) {
        this.colorsAttr?.updateBufferData(this.toArray(this.colors))
      }
    } else {
      if (this.verticesAttr) {
        this.verticesAttr.buffer = GLBuffer.f32(this.toArray(this.vertices))
        context.addAttribute(this.verticesAttr)
      }
      if (this.indicesAttr) {
        this.indicesAttr.buffer = GLBuffer.f32(this.toArray(this.indices))
        context.addAttribute(this.indicesAttr)
      }
      if (this.normalsAttr) {
        this.normalsAttr.buffer = GLBuffer.f32(this.toArray(this.normals))
        context.addAttribute(this.normalsAttr)
      }
      if (this.uvsAttr) {
        this.uvsAttr.buffer = GLBuffer.f32(this.toArray(this.uvs))
        context.addAttribute(this.uvsAttr)
      }
      if (this.colorsAttr) {
        this.colorsAttr.buffer = GLBuffer.f32(this.toArray(this.colors))
        context.addAttribute(this.colorsAttr)
      }
      this.#uploaded = true
    }
  }

  private toArray(ary:ToArray<number>[]):number[] {
    return ary.map(e => e.toArray()).flat()
  }
}