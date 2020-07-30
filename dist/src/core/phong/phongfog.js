import { Fog } from "../fog.js";
export class PhongFog extends Fog {
    setupGLVars(renderer) {
        const gl = renderer.gl;
        const useFogLocation = renderer.getUniformLocation("uUseFog");
        const fogNearLocation = renderer.getUniformLocation("uFogNear");
        const fogFarLocation = renderer.getUniformLocation("uFogFar");
        const fogColorLocation = renderer.getUniformLocation("uFogColor");
        gl.uniform1i(useFogLocation, 1);
        gl.uniform1f(fogNearLocation, this.near);
        gl.uniform1f(fogFarLocation, this.far);
        gl.uniform4fv(fogColorLocation, this.color.toArray());
    }
}
