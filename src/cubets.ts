import { Scene } from "./core/scene.js"
import { Camera } from "./core/camera.js"
import { Renderer } from "./core/renderer.js"
import { Light } from "./core/light.js"
import { Material } from "./core/material.js"
import { Mesh } from "./core/mesh.js"

import { PerspectiveCamera } from "./camera/perspectivecamera.js"
import { OrthogonalCamera } from "./camera/orthogonalcamera.js"

import { CubeGeometry } from "./geometry/cubegeometry.js"

import { Vec3 } from "./math/vec3.js"

export default {
  Scene: Scene,
  Camera: Camera,
  PerspectiveCamera: PerspectiveCamera, 
  OrthogonalCamera: OrthogonalCamera,
  Light: Light,
  CubeGeometry: CubeGeometry,
  Material: Material,
  Mesh: Mesh,
  Renderer: Renderer,
  Vec3: Vec3,
}
