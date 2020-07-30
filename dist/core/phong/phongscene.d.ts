import { Scene } from "../scene.js";
import { PhongDirectionalLight } from "./phongdirectionallight.js";
import { PhongMaterial } from "./phongmaterial.js";
import { PhongFog } from "./phongfog.js";
import { Renderer } from "../renderer.js";
export declare class PhongScene extends Scene {
    static Light: typeof PhongDirectionalLight;
    static Material: typeof PhongMaterial;
    static Fog: typeof PhongFog;
    getVertexPositionAttribLocation(renderer: Renderer): number;
    getVertexNormalAttribLocation(renderer: Renderer): number;
    getVertexColorAttribLocation(renderer: Renderer): number;
    getVertexOffsetAttribLocation(renderer: Renderer): number;
    getVertexQuatAttribLocation(renderer: Renderer): number;
    getVertexTangentAttribLocation(renderer: Renderer): number;
    getVertexTextureCoordsAttribLocation(renderer: Renderer): number;
    getProjectionMatrixUniformLocation(renderer: Renderer): WebGLUniformLocation | null;
    getModelViewMatrixUniformLocation(renderer: Renderer): WebGLUniformLocation | null;
    getNormalMatrixUniformLocation(renderer: Renderer): WebGLUniformLocation | null;
    modelViewMatrixName(): string;
    projectionMatrixName(): string;
    normalMatrixName(): string;
    getAttributeNames(): string[];
    getUniformNames(): string[];
    getVertexShader(): string;
    getFragmentShader(): string;
}
//# sourceMappingURL=phongscene.d.ts.map