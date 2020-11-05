import { Filter } from "./filter.js";

export class ToScreenFilter extends Filter {
  constructor() {
    super(`#version 300 es
      precision mediump float;

      uniform sampler2D u_image;

      in vec2 v_texCoord;
      out vec4 fragColor;

      void main() {
        fragColor = texture(u_image, v_texCoord);
      }`
    )
  }
}