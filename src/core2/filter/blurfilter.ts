import { Filter } from "./filter.js"
import { GL2Renderer } from "../../gl/gl2renderer.js"
import { GLContext } from "../../gl/glcontext.js"
import { GLProgram } from "../../gl/glprogram.js"
import { GLUniform } from "../../gl/gluniform.js"
import { GLFramebuffer } from "../../gl/glframebuffer.js"
import { GLTexture2D } from "../../gl/gltexture2d.js"

export class BlurFilter extends Filter {
  uInverseTextureSize?:GLUniform

  constructor() {
    super(`#version 300 es
      precision mediump float;

      uniform sampler2D u_image;

      in vec2 v_texCoord;
      out vec4 fragColor;

      uniform vec2 uInverseTextureSize;

      vec4 offsetLookup(float xOff, float yOff) {
        return texture(
          u_image,
          vec2(
            v_texCoord.x + xOff * uInverseTextureSize.x,
            v_texCoord.y + yOff * uInverseTextureSize.y
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
      }`,
    )
    this.uInverseTextureSize = new GLUniform("uInverseTextureSize", "2f")
    this.context.add(this.uInverseTextureSize)
  }

  render(renderer:GL2Renderer, framebuffer:GLFramebuffer|null, texture:GLTexture2D) {
    const {width, height} = renderer.container
    this.uInverseTextureSize?.updateValue([1/width, 1/height])
    super.render(renderer, framebuffer, texture)
  }
}