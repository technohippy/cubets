import { Material } from "../material.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Renderer } from "../renderer.js";
import { Mesh } from "../mesh.js";
export declare class PhongMaterial extends Material {
    diffuseColor: RGBAColor;
    ambientColor: RGBAColor;
    specularColor: RGBAColor;
    shininess: number;
    pointSize?: number;
    constructor(diffuseColor?: RGBAColor, ambientColor?: RGBAColor, specularColor?: RGBAColor, shininess?: number);
    setColor(color: RGBAColor): void;
    prepare(renderer: Renderer, mesh: Mesh): void;
    setupGLVars(renderer: Renderer, mesh: Mesh): void;
}
//# sourceMappingURL=phongmaterial.d.ts.map