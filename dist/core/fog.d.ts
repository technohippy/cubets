import { RGBAColor } from "../math/rgbacolor.js";
import { Renderer } from "./renderer.js";
export declare abstract class Fog {
    color: RGBAColor;
    near: number;
    far: number;
    constructor(color: RGBAColor, near: number, far: number);
    abstract setupGLVars(renderer: Renderer): void;
}
//# sourceMappingURL=fog.d.ts.map