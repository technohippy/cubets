import { Filter, FilterScene } from "../core/filter.js";

export class GrayscaleFilter extends Filter {
  draw() {
    this.renderer!.render(this.scene)
  }
}