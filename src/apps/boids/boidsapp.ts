import { Vec3 } from "../../math/vec3.js";
import { BoidsWorld } from "./boidsworld.js";
import { PhongScene } from "../../core/phong/phongscene.js";
import { PhongDirectionalLight } from "../../core/phong/phongdirectionallight.js";
import { RGBAColor } from "../../math/rgbacolor.js";
import { Mesh } from "../../core/mesh.js";
import { PhongMaterial } from "../../core/phong/phongmaterial.js";
import { Scene } from "../../core/scene.js";
import { PerspectiveCamera } from "../../camera/perspectivecamera.js";
import { Camera } from "../../core/camera.js";
import { OrbitCameraControl } from "../../control/orbitcameracontrol.js";
import { InstancedMesh } from "../../core/instancedmesh.js";
import { SphereGeometry } from "../../geometry/spheregeometry.js";
import { CubeTexture } from "../../core/cubetexture.js";
import { CubeGeometry } from "../../geometry/cubegeometry.js";
import { Quat } from "../../math/quat.js";

export class BoidsApp {
  world:BoidsWorld
  scene:Scene
  camera:Camera

  constructor(canvasId:string, size:Vec3, boidsCount:number, flockCount:number=1) {
    this.world = new BoidsWorld(size, boidsCount, flockCount, new Vec3(0, size.y, 0))
    this.scene = new PhongScene()
    this.camera = new PerspectiveCamera(canvasId, Math.PI/4, 0.01, size.length() * 10)
    this.camera.position.y = -0.1
    this.camera.addControl(new OrbitCameraControl())
  }

  setup() {
    const light = new PhongDirectionalLight(
      new Vec3(0.1, -1.0, -0.4),
      RGBAColor.Black,
      RGBAColor.White,
      RGBAColor.White
    )
    this.scene.add(light)

    const light2 = new PhongDirectionalLight(
      new Vec3(-0.2, 1.0, 0.2),
      RGBAColor.Gray,
      RGBAColor.Gray,
      RGBAColor.Black
    )
    this.scene.add(light2)

    const skyboxMaterial = new PhongMaterial(RGBAColor.White)
    skyboxMaterial.cubeTexture = new CubeTexture(
      "/examples/images/skybox/mountain-skyboxes/Maskonaive/negx.jpg",
      "/examples/images/skybox/mountain-skyboxes/Maskonaive/posx.jpg",
      "/examples/images/skybox/mountain-skyboxes/Maskonaive/negy.jpg",
      "/examples/images/skybox/mountain-skyboxes/Maskonaive/posy.jpg",
      "/examples/images/skybox/mountain-skyboxes/Maskonaive/negz.jpg",
      "/examples/images/skybox/mountain-skyboxes/Maskonaive/posz.jpg"
    )
    skyboxMaterial.cubeTexture.isSkybox = true
    const skyMesh = new Mesh(
      new CubeGeometry(1000, 1000, 1000),
      skyboxMaterial,
    )
    this.scene.add(skyMesh)



    const boidsMeshes = new InstancedMesh(
      this.world.boids.length,
      //new SphereGeometry(2),
      new CubeGeometry(4, 4, 4),
      new PhongMaterial(),
    )
    this.world.boids.forEach((boid, i) => {
      const mesh = boidsMeshes.get(i)
      mesh.position = boid.position
      if (i != 0) {
        mesh.rotation = Quat.fromEulerDegrees(
          Math.random() * 180,
          Math.random() * 180,
          Math.random() * 180,
        )
      }
    })
    this.scene.add(boidsMeshes)
  }

  start() {
    this.camera.start(this.scene)
    setInterval(() => { this.world.step() }, 30)
  }
}