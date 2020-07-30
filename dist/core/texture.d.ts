export declare enum TextureType {
    Texture = 0,
    CubeTexture = 1,
    NormalTexture = 2
}
export declare class Texture {
    type: TextureType;
    image: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
    constructor(image: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, type?: TextureType);
    loadImage(): Promise<void>;
    setupGLTexture(gl: WebGL2RenderingContext, location: WebGLUniformLocation, unit?: number): void;
}
//# sourceMappingURL=texture.d.ts.map