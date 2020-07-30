/**
 * RenderTarget manages a frame buffer.
 */
export declare class RenderTarget {
    width: number;
    height: number;
    texture?: WebGLTexture;
    renderbuffer?: WebGLRenderbuffer;
    frameBuffer: WebGLFramebuffer | null;
    constructor(width: number, height: number);
    setup(gl: WebGL2RenderingContext): void;
    reset(gl: WebGL2RenderingContext): void;
    setupGLVars(gl: WebGL2RenderingContext, samplerLocation: WebGLUniformLocation | null): void;
    apply(gl: WebGL2RenderingContext): void;
}
//# sourceMappingURL=rendertarget.d.ts.map