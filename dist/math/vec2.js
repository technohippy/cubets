//@ts-ignore
import { glMatrix, vec3 } from "../../node_modules/gl-matrix/esm/index.js";
glMatrix.setMatrixArrayType(Array);
export class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    distance(v) {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    }
    translate(amount) {
        this.asArray((vals) => {
            return vec3.add(vals, vals, amount);
        });
    }
    toArray() {
        return [this.x, this.y];
    }
    fromArray(values) {
        [this.x, this.y] = values;
    }
    asArray(fn) {
        this.fromArray(fn(this.toArray()));
    }
}
