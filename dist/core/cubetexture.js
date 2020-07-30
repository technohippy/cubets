import { TextureType } from "./texture.js";
export class CubeTexture {
    constructor(imageNx, imagePx, imageNy, imagePy, imageNz, imagePz) {
        this.isSkybox = false;
        this.image = imageNx; // TODO
        this.images = [imageNx, imagePx, imageNy, imagePy, imageNz, imagePz];
        this.type = TextureType.CubeTexture;
    }
    loadImage() {
        return Promise.all(this.images.map((image, i) => {
            return new Promise((resolve, reject) => {
                if (typeof image === "string") {
                    const img = new Image();
                    img.onload = () => {
                        this.images[i] = img;
                        resolve();
                    };
                    img.src = image;
                }
                else {
                    resolve();
                }
            });
        }));
    }
    setupGLTexture(gl, location, skyboxLocation) {
        if (!this.cubeTexture) {
            this.images.forEach((image, i) => {
                if (typeof image === "string") {
                    const img = new Image();
                    img.src = image;
                    this.images[i] = img;
                }
            });
            this.cubeTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeTexture);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[0]);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[1]);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[2]);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[3]);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[4]);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[5]);
        }
        else {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeTexture);
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(location, 0);
        if (skyboxLocation) {
            gl.uniform1i(skyboxLocation, this.isSkybox ? 1 : 0);
        }
        this.cubeTexture = undefined;
    }
}
