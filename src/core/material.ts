import { Renderer } from "./renderer.js";
import { Texture } from "./texture.js";
import { Mesh } from "./mesh.js";
import { CubeTexture } from "./cubetexture.js";

export abstract class Material {
  wireframe = false
  normal = false
  skipPrepare = false

  textures: Texture[] = []
  cubeTexture?: CubeTexture
  normalTexture?: Texture

  get texture(): Texture {
    if (1 < this.textures.length) {
      throw "use #textures"
    }
    return this.textures[0]
  }

  set texture(texture:Texture) {
    if (this.textures.length === 0) {
      this.textures.push(texture)
    } else if (this.textures.length === 1) {
      this.textures[0] = texture
    } else {
      throw "use addTexture() or #textures"
    }
  }

  addTexture(texture:Texture) {
    this.textures.push(texture)
  }

  clearTexture() {
    this.textures.length = 0
  }

  abstract prepare(renderer:Renderer, mesh:Mesh): void;
  abstract setupGLVars(renderer:Renderer, mesh:Mesh): void;
}