import { Camera } from "../core/camera.js";
//@ts-ignore
import { glMatrix, mat4 } from "../../node_modules/gl-matrix/esm/index.js";
glMatrix.setMatrixArrayType(Array);
export class PerspectiveCamera extends Camera {
    constructor(viewport, fov, near, far) {
        super(viewport);
        this.fov = fov;
        if (near <= 0) {
            console.warn(`near must be more than zero: ${near}`);
            near = 0.001;
        }
        this.near = near;
        this.far = far;
    }
    setupProjectionMatrix() {
        mat4.perspective(this.projectionMatrix, this.fov, this.getAspectRatio(), this.near, this.far);
    }
}
