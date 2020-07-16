import { Filter } from "../core/filter.js";

export class InvertFilter extends Filter {
  constructor() {
    super(`
      fragColor = vec4(1.0 - frameColor.r, 1.0 - frameColor.g, 1.0 - frameColor.b, frameColor.a);
    `)
  }
}