import { Filter, FilterScene, FilterMaterial } from "../core/filter.js"
import { Renderer } from "../core/renderer.js"

export class BlurFilter extends Filter {
  constructor() {
    super(new BlurScene(), new BlurMaterial())
  }
}

class BlurMaterial extends FilterMaterial {
  setupGLVars(renderer:Renderer) {
    super.setupGLVars(renderer)

    const gl = renderer.gl
    const { width, height } = renderer.container!
    const inverseTexturSizeLocation = renderer.getUniformLocation("uInverseTextureSize")
    gl.uniform2f(inverseTexturSizeLocation, 1/width, 1/height)
  }
}

class BlurScene extends FilterScene {
  getUniformNames(): string[] {
    const names = super.getUniformNames()
    names.push("uInverseTextureSize")
    return names
  }

  getFragmentShader():string {
    return `${this.getFragmentShaderHead()}

      uniform vec2 uInverseTextureSize;

      vec4 offsetLookup(float xOff, float yOff) {
        return texture(
          uSampler,
          vec2(
            vTextureCoords.x + xOff * uInverseTextureSize.x,
            vTextureCoords.y + yOff * uInverseTextureSize.y
          )
        );
      }

      void main(void) {
        vec4 frameColor = offsetLookup(-4.0, 0.0) * 0.05;
        frameColor += offsetLookup(-3.0, 0.0) * 0.09;
        frameColor += offsetLookup(-2.0, 0.0) * 0.12;
        frameColor += offsetLookup(-1.0, 0.0) * 0.15;
        frameColor += offsetLookup(0.0, 0.0) * 0.16;
        frameColor += offsetLookup(1.0, 0.0) * 0.15;
        frameColor += offsetLookup(2.0, 0.0) * 0.12;
        frameColor += offsetLookup(3.0, 0.0) * 0.09;
        frameColor += offsetLookup(4.0, 0.0) * 0.05;
        fragColor = frameColor;
      }
   `
  }
}