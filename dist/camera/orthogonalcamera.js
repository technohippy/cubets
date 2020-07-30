import { Camera } from "../core/camera.js";
//@ts-ignore
import { glMatrix, mat4 } from "../../node_modules/gl-matrix/esm/index.js";
glMatrix.setMatrixArrayType(Array);
export class OrthogonalCamera extends Camera {
    constructor(viewport, width, near, far) {
        super(viewport);
        const height = width / this.getAspectRatio();
        this.left = -width / 2;
        this.right = +width / 2;
        this.bottom = -height / 2;
        this.top = +height / 2;
        this.near = near;
        this.far = far;
    }
    setupProjectionMatrix() {
        mat4.ortho(this.projectionMatrix, this.left, this.right, this.bottom, this.top, this.near, this.far);
    }
}
