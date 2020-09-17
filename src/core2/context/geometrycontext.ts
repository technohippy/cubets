import { GeometryConfig, Geometry } from "../geometry.js";
import { GLAttribute } from "../../gl/glattribute.js";
import { GLContext } from "../../gl/glcontext.js";
import { GLBuffer } from "../../gl/glbuffer.js";
import { ToArray } from "../../misc/toarray.js";
import { GLIndex } from "../../gl/glindex.js";

export class GeometryContext {
  verticesAttr?:GLAttribute
  normalsAttr?:GLAttribute
  uvsAttr?:GLAttribute
  colorsAttr?:GLAttribute

  constructor(config:GeometryConfig) {
    this.verticesAttr = config["vertices"]
    this.normalsAttr = config["normals"]
    this.uvsAttr = config["uvs"]
    this.colorsAttr = config["colors"]
  }

  upload(context:GLContext, geometry:Geometry) {
    if (0 < geometry.indices.length) {
      context.index = new GLIndex()
      context.index.buffer = GLBuffer.ui16(this.toArray(geometry.indices))
    }

    if (this.verticesAttr) {
      this.verticesAttr.buffer = GLBuffer.f32(this.toArray(geometry.transformedVertices()))
      context.addAttribute(this.verticesAttr)
    }
    if (this.normalsAttr) {
      this.normalsAttr.buffer = GLBuffer.f32(this.toArray(geometry.transformedNormals()))
      context.addAttribute(this.normalsAttr)
    }
    if (this.uvsAttr) {
      this.uvsAttr.buffer = GLBuffer.f32(this.toArray(geometry.uvs))
      context.addAttribute(this.uvsAttr)
    }
    if (this.colorsAttr) {
      this.colorsAttr.buffer = GLBuffer.f32(this.toArray(geometry.colors))
      context.addAttribute(this.colorsAttr)
    }
  }

  write(context:GLContext, geometry:Geometry) {
    if (0 < geometry.indices.length) {
      if (context.index) {
        context.index?.updateBufferData(this.toArray(geometry.indices))
      } else {
        context.index = new GLIndex()
        context.index.buffer = GLBuffer.ui16(this.toArray(geometry.indices))
      }
    }

    if (0 < geometry.vertices.length) {
      this.verticesAttr?.updateBufferData(this.toArray(geometry.transformedVertices()))
    }
    if (0 < geometry.normals.length) {
      this.normalsAttr?.updateBufferData(this.toArray(geometry.transformedNormals()))
    }
    if (0 < geometry.uvs.length) {
      this.uvsAttr?.updateBufferData(this.toArray(geometry.uvs))
    }
    if (0 < geometry.colors.length) {
      this.colorsAttr?.updateBufferData(this.toArray(geometry.colors))
    }
  }

  private toArray(ary:ToArray<number>[]):number[] {
    return ary.map(e => e.toArray()).flat()
  }
}