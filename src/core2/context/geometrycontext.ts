import { GeometryConfig } from "../geometry.js";
import { GLAttribute } from "../../gl/glattribute.js";

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
}