import { Filter } from "./filter.js"
import { GL2Renderer } from "../../gl/gl2renderer.js"
import { GLContext } from "../../gl/glcontext.js"

export class BlurFilter extends Filter {
  constructor() {
    super(`
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
      }`
    )
  }

  render(renderer:GL2Renderer, context:GLContext) {

  }
}