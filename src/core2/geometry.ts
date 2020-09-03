import { Vec2 } from "../math/vec2.js";
import { Vec3 } from "../math/vec3.js";
import { Face3 } from "../math/face3.js";
import { RGBAColor } from "../math/rgbacolor.js";
import { GLContext } from "../gl/glcontext.js";
import { GLAttribute } from "../gl/glattribute.js";
import { GLBuffer } from "../gl/glbuffer.js"
import { ToArray } from "../misc/toarray.js";
import { ContextWriter } from "./contextwriter.js";
import { GLImage } from "../gl/glimage.js";
import { GLIndex } from "../gl/glindex.js";

type GeometryConfigKey = "vertices" | "indices" | "normals" | "uvs" | "colors"
export type GeometryConfig = {[key in GeometryConfigKey]?:GLAttribute}

export class Geometry implements ContextWriter {
  indices:Face3[] = []
  vertices:Vec3[] = []

  normals:Vec3[] = []
  uvs:Vec2[] = []
  colors:RGBAColor[] = []

  verticesAttr?:GLAttribute
  normalsAttr?:GLAttribute
  uvsAttr?:GLAttribute
  colorsAttr?:GLAttribute

  #uploaded = false

  setupContextVars(config:GeometryConfig) {
    this.verticesAttr = config["vertices"]
    this.normalsAttr = config["normals"]
    this.uvsAttr = config["uvs"]
    this.colorsAttr = config["colors"]
  }

  writeContext(context:GLContext) {
    if (this.#uploaded) {
      if (0 < this.vertices.length) {
        this.verticesAttr?.updateBufferData(this.toArray(this.vertices))
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
      if (0 < this.indices.length) {
        context.index = new GLIndex()
        context.index.buffer = GLBuffer.ui16(this.toArray(this.indices))
      }

      if (this.verticesAttr) {
        this.verticesAttr.buffer = GLBuffer.f32(this.toArray(this.vertices))
        context.addAttribute(this.verticesAttr)
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

  static computeNormals(indices:Face3[], vertices:Vec3[]): Vec3[] {
    const normals:Vec3[][] = []
    indices.forEach(index => {
      const normal = index.normal(vertices)
      index.toArray().forEach(i => {
        if (!normals[i]) {
          normals[i] = []
        }
        normals[i].push(normal)
      })
    })
    return normals.map(vs => {
      const sumV = vs.reduce((sum, val):Vec3 => sum.add(val), new Vec3(0, 0, 0))
      return sumV.normalize()
    })
  }
}