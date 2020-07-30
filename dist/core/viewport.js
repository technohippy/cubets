import { Vec2 } from "../math/vec2.js";
export class Viewport {
    constructor(topLeft = new Vec2(), size = new Vec2(1, 1), container) {
        if (typeof container === "string") {
            container = document.getElementById(container);
        }
        this.container = container;
        this.topLeft = topLeft;
        this.size = size;
    }
    getAspectRatio() {
        if (this.container) {
            return (this.container.width * this.size.x) / (this.container.height * this.size.y);
        }
        else {
            return this.size.x / this.size.y;
        }
    }
    apply(gl) {
        if (this.container) {
            gl.viewport(this.container.width * this.topLeft.x, this.container.height * this.topLeft.y, this.container.width * this.size.x, this.container.height * this.size.y);
        }
        else {
            gl.viewport(this.topLeft.x, this.topLeft.y, this.size.x, this.size.y);
        }
    }
}
