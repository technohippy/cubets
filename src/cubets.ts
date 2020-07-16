import { PhongScene } from "./core/phong/phongscene.js"
import { Camera } from "./core/camera.js"
import { Renderer } from "./core/renderer.js"
import { Light } from "./core/light.js"
import { PhongDirectionalLight } from "./core/phong/phongdirectionallight.js"
import { PhongPositionalLight } from "./core/phong/phongpositionallight.js"
import { PhongSpotLight } from "./core/phong/phongspotlight.js"
import { Material } from "./core/material.js"
import { Mesh } from "./core/mesh.js"
import { Viewport } from "./core/viewport.js"
import { Texture } from "./core/texture.js"

import { PerspectiveCamera } from "./camera/perspectivecamera.js"
import { OrthogonalCamera } from "./camera/orthogonalcamera.js"

import { PlaneGeometry } from "./geometry/planegeometry.js"
import { GroundGeometry } from "./geometry/groundgeometry.js"
import { CubeGeometry } from "./geometry/cubegeometry.js"
import { SphereGeometry } from "./geometry/spheregeometry.js"
import { CylinderGeometry } from "./geometry/cylindergeometry.js"

import { GrayscaleFilter } from "./filter/grayscalefilter.js"
import { InvertFilter } from "./filter/invertfilter.js"
import { BlurFilter } from "./filter/blurfilter.js"

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
  PhongSpotLight: PhongSpotLight,
  PlaneGeometry: PlaneGeometry,
  GroundGeometry: GroundGeometry,
  CubeGeometry: CubeGeometry,
  SphereGeometry: SphereGeometry,
  CylinderGeometry: CylinderGeometry,
  GrayscaleFilter: GrayscaleFilter,
  InvertFilter: InvertFilter,
  BlurFilter: BlurFilter,
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
