var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _textures;
import { Mesh } from './mesh.js';
import { Light } from './light.js';
import { Lights } from './lights.js';
import { TextureType } from './texture.js';
import { RGBAColor } from '../math/rgbacolor.js';
import { PhongReflectionMaterial } from './phong/phongreflectionmaterial.js';
import { Particles } from './particles.js';
export class Scene {
    constructor() {
        this.clearColor = RGBAColor.Black;
        this.meshes = [];
        this.reflectionMeshes = [];
        this.lights = new Lights();
        _textures.set(this, void 0);
    }
    add(...objs) {
        objs.forEach(obj => {
            if (obj instanceof Mesh) {
                this.addMesh(obj);
            }
            else if (obj instanceof Light) {
                this.addLight(obj);
            }
        });
    }
    addMesh(...meshes) {
        meshes.forEach(mesh => {
            // TODO: PhongReflectionMaterial が漏れているのでどうにかする
            if (mesh.material instanceof PhongReflectionMaterial) {
                this.reflectionMeshes.push(mesh);
            }
            else {
                this.meshes.push(mesh);
            }
        });
    }
    addLight(...lights) {
        lights.forEach(light => this.lights.push(light));
    }
    each(fn) {
        this.eachMesh(fn);
        this.eachLight(fn);
    }
    eachMesh(fn) {
        this.meshes.forEach(m => {
            m.forEachChild(fn);
            fn(m);
        });
        this.reflectionMeshes.forEach(m => {
            m.forEachChild(fn);
            fn(m);
        });
    }
    eachLight(fn) {
        this.lights.forEach(fn);
    }
    collectTextures() {
        if (__classPrivateFieldGet(this, _textures) === undefined) {
            __classPrivateFieldSet(this, _textures, []);
            this.eachMesh(mesh => {
                __classPrivateFieldGet(this, _textures)?.push(...mesh.material.textures);
                const ntex = mesh.material.normalTexture;
                if (ntex)
                    __classPrivateFieldGet(this, _textures)?.push(ntex);
                const ctex = mesh.material.cubeTexture;
                if (ctex)
                    __classPrivateFieldGet(this, _textures)?.push(ctex);
            });
        }
        return __classPrivateFieldGet(this, _textures);
    }
    hasTextureType(type) {
        const textures = this.collectTextures();
        for (let i = 0; i < textures.length; i++) {
            const texture = textures[i];
            if (texture.type === type) {
                return true;
            }
        }
        return false;
    }
    hasTexture() {
        return this.hasTextureType(TextureType.Texture);
    }
    hasNormalTexture() {
        return this.hasTextureType(TextureType.NormalTexture);
    }
    hasCubeTexture() {
        return this.hasTextureType(TextureType.CubeTexture);
    }
    hasParticles() {
        for (let i = 0; i < this.meshes.length; i++) {
            const mesh = this.meshes[i];
            if (mesh instanceof Particles) {
                return true;
            }
        }
        return false;
    }
    async loadAllTextures() {
        return Promise.all(this.collectTextures().map(t => t.loadImage()));
    }
}
_textures = new WeakMap();
