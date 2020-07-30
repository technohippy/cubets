import { Renderer } from "./renderer.js";
import { Texture } from "./texture.js";
import { Mesh } from "./mesh.js";
import { CubeTexture } from "./cubetexture.js";
import { RGBAColor } from "../math/rgbacolor.js";
export declare abstract class Material {
    wireframe: boolean;
    normal: boolean;
    skipPrepare: boolean;
    textures: Texture[];
    cubeTexture?: CubeTexture;
    normalTexture?: Texture;
    get texture(): Texture;
    set texture(texture: Texture);
    addTexture(texture: Texture): void;
    clearTexture(): void;
    abstract setColor(color: RGBAColor): void;
    abstract prepare(renderer: Renderer, mesh: Mesh): void;
    abstract setupGLVars(renderer: Renderer, mesh: Mesh): void;
}
//# sourceMappingURL=material.d.ts.map