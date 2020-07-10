import { Material } from "../material.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Scene } from "../scene.js";

export class PhongMaterial extends Material {
  diffuseColor: RGBAColor

  constructor(diffuseColor: RGBAColor=RGBAColor.random()) {
    super()
    this.diffuseColor = diffuseColor
  }

  setupGLVars(gl:WebGL2RenderingContext, scene:Scene) {
    const materialDiffuseLocation = scene.getUniformLocation("uMaterialDiffuse")
    gl.uniform4fv(materialDiffuseLocation, this.diffuseColor.toArray())
  }
}