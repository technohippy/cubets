import { Light } from "./light.js";
import { Renderer } from "./renderer.js";
export declare class Lights {
    lights: Light[];
    setupGLVars(renderer: Renderer): void;
    get length(): number;
    push(light: Light): void;
    forEach(fn: (l: Light, i?: number) => void): void;
}
//# sourceMappingURL=lights.d.ts.map