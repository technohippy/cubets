export class Material {
    constructor() {
        this.wireframe = false;
        this.normal = false;
        this.skipPrepare = false;
        this.textures = [];
    }
    get texture() {
        if (1 < this.textures.length) {
            throw "use #textures";
        }
        return this.textures[0];
    }
    set texture(texture) {
        if (this.textures.length === 0) {
            this.textures.push(texture);
        }
        else if (this.textures.length === 1) {
            this.textures[0] = texture;
        }
        else {
            throw "use addTexture() or #textures";
        }
    }
    addTexture(texture) {
        this.textures.push(texture);
    }
    clearTexture() {
        this.textures.length = 0;
    }
}
