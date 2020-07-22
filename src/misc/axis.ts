import { Mesh } from "../core/mesh.js";
import { AxisGeometry } from "./axisgeometry.js";
import { PhongMaterial } from "../core/phong/phongmaterial.js";
import { RGBAColor } from "../math/rgbacolor.js";

export class Axis extends Mesh {
  constructor(size:number) {
    super(new AxisGeometry(size), new PhongMaterial())
    this.material.wireframe = true
  }
}