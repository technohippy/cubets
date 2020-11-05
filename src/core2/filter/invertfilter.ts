import { Filter } from "./filter.js";

export class InvertFilter extends Filter {
  constructor() {
    super(`#version 300 es
      precision mediump float;

      uniform sampler2D u_image;

      in vec2 v_texCoord;
      out vec4 fragColor;

      void main() {
        vec4 frameColor = texture(u_image, v_texCoord);
        fragColor = vec4(1.0 - frameColor.r, 1.0 - frameColor.g, 1.0 - frameColor.b, frameColor.a);
      }`
    )
  }
}