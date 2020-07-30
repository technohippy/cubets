import { Vec3 } from "../../math/vec3.js";
import { BoidsWorld } from "./boidsworld.js";
import { PhongScene } from "../../core/phong/phongscene.js";
import { PhongDirectionalLight } from "../../core/phong/phongdirectionallight.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Mesh } from "../../core/mesh.js";
import { PhongMaterial } from "../../core/phong/phongmaterial.js";
import { PerspectiveCamera } from "../../camera/perspectivecamera.js";
import { OrbitCameraControl } from "../../control/orbitcameracontrol.js";
import { InstancedMesh } from "../../core/instancedmesh.js";
import { CubeTexture } from "../../core/cubetexture.js";
import { CubeGeometry } from "../../geometry/cubegeometry.js";
import { Quat } from "../../math/quat.js";
//@ts-ignore
import { glMatrix, quat } from "../../../node_modules/gl-matrix/esm/index.js";
import { JSONGeometryLoader } from "../../misc/jsongeometryloader.js";
glMatrix.setMatrixArrayType(Array);
export class BoidsApp {
    constructor(canvasId, size, boidsCount, flockCount = 1) {
        this.world = new BoidsWorld(size, boidsCount, flockCount, new Vec3(0, size.y * 0.75, 0));
        this.scene = new PhongScene();
        this.camera = new PerspectiveCamera(canvasId, Math.PI / 4, 0.01, size.length() * 10);
        this.camera.position.y = -0.1;
        this.camera.addControl(new OrbitCameraControl());
    }
    setup(imagePath) {
        const light = new PhongDirectionalLight(new Vec3(0.1, -1.0, -0.4), RGBAColor.Black, RGBAColor.White, RGBAColor.White);
        this.scene.add(light);
        const light2 = new PhongDirectionalLight(new Vec3(-0.2, 1.0, 0.2), RGBAColor.Gray, RGBAColor.Gray, RGBAColor.Black);
        this.scene.add(light2);
        const skyboxMaterial = new PhongMaterial(RGBAColor.White);
        skyboxMaterial.cubeTexture = new CubeTexture(`${imagePath}/skybox/mountain-skyboxes/Maskonaive/negx.jpg`, `${imagePath}/skybox/mountain-skyboxes/Maskonaive/posx.jpg`, `${imagePath}/skybox/mountain-skyboxes/Maskonaive/negy.jpg`, `${imagePath}/skybox/mountain-skyboxes/Maskonaive/posy.jpg`, `${imagePath}/skybox/mountain-skyboxes/Maskonaive/negz.jpg`, `${imagePath}/skybox/mountain-skyboxes/Maskonaive/posz.jpg`
        /*
        "../../../examples/images/skybox/mountain-skyboxes/Maskonaive/negx.jpg",
        "../../../examples/images/skybox/mountain-skyboxes/Maskonaive/posx.jpg",
        "../../../examples/images/skybox/mountain-skyboxes/Maskonaive/negy.jpg",
        "../../../examples/images/skybox/mountain-skyboxes/Maskonaive/posy.jpg",
        "../../../examples/images/skybox/mountain-skyboxes/Maskonaive/negz.jpg",
        "../../../examples/images/skybox/mountain-skyboxes/Maskonaive/posz.jpg"
        */
        );
        skyboxMaterial.cubeTexture.isSkybox = true;
        const skyMesh = new Mesh(new CubeGeometry(2000, 2000, 2000), skyboxMaterial);
        this.scene.add(skyMesh);
        return JSONGeometryLoader.load("../../examples/data/Bird_01.json").then(geometry => {
            geometry.vertices.forEach(v => {
                v.rotate(Math.PI / 2, new Vec3(1, 0, 0));
                v.rotate(-Math.PI / 2, new Vec3(0, 1, 0));
                v.multiplyScalar(0.02);
            });
            this.boidsMeshes = new InstancedMesh(this.world.boids.length, geometry, 
            //new PhongMaterial(RGBAColor.White),
            new PhongMaterial(RGBAColor.Gray));
            this.world.boids.forEach((boid, i) => {
                const mesh = this.boidsMeshes.get(i);
                mesh.position = boid.position;
            });
            this.scene.add(this.boidsMeshes);
        });
    }
    start() {
        this.camera.start(this.scene);
        const sizeY = this.world.size.y;
        let t = 0;
        setInterval(() => {
            this.world.center.y = sizeY * 0.75 + 0.2 * Math.sin(t / 180 * Math.PI);
            t++;
            this.world.step();
            this.world.boids.forEach((boid, i) => {
                const velocity = boid.velocity;
                const mesh = this.boidsMeshes.get(i);
                const z = velocity.clone().normalize();
                const x = z.cross(new Vec3(0, 1, 0));
                const y = z.cross(x);
                const m3 = [
                    x.x, y.x, z.x,
                    x.y, y.y, z.y,
                    x.z, y.z, z.z,
                ];
                const q = quat.fromMat3(quat.create(), m3);
                mesh.rotation = new Quat(...q);
            });
        }, 30);
    }
}
