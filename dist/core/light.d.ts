import { Renderer } from "./renderer";
export declare abstract class Light {
    abstract getGLVars(renderer: Renderer): {
        type: string;
        loc: WebGLUniformLocation;
        value: any;
    }[];
}
//# sourceMappingURL=light.d.ts.map