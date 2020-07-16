import { Filter } from "../core/filter.js";

export class GrayscaleFilter extends Filter {
  constructor() {
    super(`
      float luminance = frameColor.r * 0.3 + frameColor.g * 0.59 + frameColor.b * 0.11;
      fragColor = vec4(luminance, luminance, luminance, frameColor.a);
    `)
  }
}