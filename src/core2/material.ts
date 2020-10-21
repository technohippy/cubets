import { MaterialContext } from "./context/materialcontext.js";
import { Texture } from "./texture.js";
import { CubeTexture } from "./cubetexture.js";

export abstract class Material {
  wireframe = false
  normal = false
  texture?:Texture
  cubeTexture?:CubeTexture

  abstract setupContext(config:{[key:string]:any}):MaterialContext
}