import { Renderer } from "./core2/renderer.js";
import { Scene } from "./core2/scene.js";
import { PhongScene } from "./core2/phongscene.js";
import { PhongDirectionalLight } from "./core2/phongdirectionallight.js";
import { Mesh } from "./core2/mesh.js";
import { Geometry } from "./core2/geometry.js";
import { CubeGeometry } from "./core2/cubegeometry.js";
import { Material } from "./core2/material.js";
import { Vec2 } from "./math/vec2.js";
import { Vec3 } from "./math/vec3.js";
import { Quat } from "./math/quat.js";
import { RGBAColor } from "./math/rgbacolor.js"
import { OrbitCameraControl } from "./core2/control/orbitcameracontrol.js";
import { GLAttribute } from "./gl/glattribute.js";
import { GLContext } from "./gl/glcontext.js";
import { SceneContext } from "./core2/context/scenecontext.js";

export default {
  Renderer:Renderer,
  Scene:Scene,
  SceneContext:SceneContext,
  PhongScene:PhongScene,
  PhongDirectionalLight:PhongDirectionalLight,
  Mesh:Mesh,
  Geometry:Geometry,
  CubeGeometry:CubeGeometry,
  Material:Material,
  Vec2:Vec2,
  Vec3:Vec3,
  Quat:Quat,
  RGBAColor:RGBAColor,
  OrbitCameraControl:OrbitCameraControl,
  GLAttribute:GLAttribute,
  GLContext:GLContext,
}