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

export class BoidsApp {
  world:BoidsWorld
  scene:Scene
  camera:Camera

  constructor(canvasId:string, size:Vec3, boidsCount:number, flockCount:number=1) {
    this.world = new BoidsWorld(size, boidsCount, flockCount)
    this.scene = new PhongScene()
    this.camera = new PerspectiveCamera(canvasId, Math.PI/4, 0.01, size.length() * 10)
    this.camera.position.x = 100
    this.camera.addControl(new OrbitCameraControl())
  }

  setup() {
    const light = new PhongDirectionalLight(
        new Vec3(0.2, 0.3, -1),
        new RGBAColor(0.6, 0.6, 0.6),
        new RGBAColor(0.8, 0.8, 0.8)
    )
    this.scene.add(light)

    const light2 = new PhongDirectionalLight(
        new Vec3(-0.3, -0.2, 1),
        new RGBAColor(0.6, 0.6, 0.6),
        new RGBAColor(0.8, 0.8, 0.8)
    )
    this.scene.add(light2)

    const boidsMeshes = new InstancedMesh(
      this.world.boids.length,
      new SphereGeometry(2),
      new PhongMaterial(),
    )
    this.world.boids.forEach((boid, i) => {
      boidsMeshes.get(i).position = boid.position
    })
    this.scene.add(boidsMeshes)
  }

  start() {
    this.camera.start(this.scene)
    setInterval(() => { this.world.step() }, 30)
  }
}