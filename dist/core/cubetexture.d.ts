import { Texture, TextureType } from "./texture.js";
export declare class CubeTexture implements Texture {
    type: TextureType;
    image: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
    images: (string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement)[];
    isSkybox: boolean;
    cubeTexture?: WebGLTexture;
    constructor(imageNx: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, imagePx: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, imageNy: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, imagePy: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, imageNz: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, imagePz: string | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement);
    loadImage(): Promise<any>;
    setupGLTexture(gl: WebGL2RenderingContext, location: WebGLUniformLocation, skyboxLocation?: WebGLUniformLocation): void;
}
//# sourceMappingURL=cubetexture.d.ts.map