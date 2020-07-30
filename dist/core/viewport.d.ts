import { Vec2 } from "../math/vec2.js";
export declare class Viewport {
    container?: HTMLCanvasElement;
    topLeft: Vec2;
    size: Vec2;
    constructor(topLeft?: Vec2, size?: Vec2, container?: HTMLCanvasElement | string);
    getAspectRatio(): number;
    apply(gl: WebGL2RenderingContext): void;
}
//# sourceMappingURL=viewport.d.ts.map