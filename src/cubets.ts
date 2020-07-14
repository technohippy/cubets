import { Scene } from "./core/scene.js"
import { PhongScene } from "./core/phong/phongscene.js"
import { Camera } from "./core/camera.js"
import { Renderer } from "./core/renderer.js"
import { Light } from "./core/light.js"
import { PhongDirectionalLight } from "./core/phong/phongdirectionallight.js"
import { PhongPositionalLight } from "./core/phong/phongpositionallight.js"
import { Material } from "./core/material.js"
import { Mesh } from "./core/mesh.js"
import { Viewport } from "./core/viewport.js"
import { Texture } from "./core/texture.js"

import { PerspectiveCamera } from "./camera/perspectivecamera.js"
import { OrthogonalCamera } from "./camera/orthogonalcamera.js"

import { CubeGeometry } from "./geometry/cubegeometry.js"
import { SphereGeometry } from "./geometry/spheregeometry.js"
import { CylinderGeometry } from "./geometry/cylindergeometry.js"

import { OrbitCameraControl } from "./control/orbitcameracontrol.js"

import { Vec2 } from "./math/vec2.js"
import { Vec3 } from "./math/vec3.js"
import { Quat } from "./math/quat.js"
import { RGBAColor } from "./math/rgbacolor.js"

export default {
  Scene: PhongScene,
  PhongScene: PhongScene,
  Camera: Camera,
  PerspectiveCamera: PerspectiveCamera, 
  OrthogonalCamera: OrthogonalCamera,
  Light: Light,
  PhongPositionalLight: PhongPositionalLight,
  PhongDirectionalLight: PhongDirectionalLight,
  CubeGeometry: CubeGeometry,
  SphereGeometry: SphereGeometry,
  CylinderGeometry: CylinderGeometry,
  Material: Material,
  Mesh: Mesh,
  Renderer: Renderer,
  OrbitCameraControl: OrbitCameraControl,
  Vec2: Vec2,
  Vec3: Vec3,
  Quat: Quat,
  RGBAColor: RGBAColor,
  Color: RGBAColor,
  Viewport: Viewport,
  Texture: Texture,
}
