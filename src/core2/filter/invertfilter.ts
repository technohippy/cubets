import { Filter } from "./filter.js";
import { GL2Renderer } from "../../gl/gl2renderer.js";
import { GLContext } from "../../gl/glcontext.js";

export class InvertFilter extends Filter {
  constructor() {
    super(`
      fragColor = vec4(1.0 - frameColor.r, 1.0 - frameColor.g, 1.0 - frameColor.b, frameColor.a);
    `)
  }

  render(renderer:GL2Renderer, context:GLContext) {

  }
}