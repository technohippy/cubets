// core
import { Renderer } from "./core2/renderer.js";
import { Scene } from "./core2/scene.js";
import { PhongScene } from "./core2/phongscene.js";
import { PhongDirectionalLight } from "./core2/phongdirectionallight.js";
import { PhongPositionalLight } from "./core2/phongpositionallight.js";
import { PhongSpotLight } from "./core2/phongspotlight.js";
import { Mesh } from "./core2/mesh.js";
import { Geometry } from "./core2/geometry.js";
import { PlaneGeometry } from "./core2/geometry/planegeometry.js";
import { GroundGeometry } from "./core2/geometry/groundgeometry.js";
import { CubeGeometry } from "./core2/geometry/cubegeometry.js";
import { SphereGeometry } from "./core2/geometry/spheregeometry.js";
import { CylinderGeometry } from "./core2/geometry/cylindergeometry.js";
import { Material } from "./core2/material.js";
import { Texture } from "./core2/texture.js";
import { CubeTexture } from "./core2/cubetexture.js";
import { OrbitCameraControl } from "./core2/control/orbitcameracontrol.js";
import { SceneContext } from "./core2/context/scenecontext.js";

// gl
import { GLAttribute } from "./gl/glattribute.js";
import { GLContext } from "./gl/glcontext.js";

// math
import { Vec2 } from "./math/vec2.js";
import { Vec3 } from "./math/vec3.js";
import { Quat } from "./math/quat.js";
import { RGBAColor } from "./math/rgbacolor.js"

export default {
  Renderer:Renderer,
  Scene:Scene,
  PhongScene:PhongScene,
  SceneContext:SceneContext,
  PhongDirectionalLight:PhongDirectionalLight,
  PhongPositionalLight:PhongPositionalLight,
  PhongSpotLight:PhongSpotLight,
  Mesh:Mesh,
  Geometry:Geometry,
  PlaneGeometry:PlaneGeometry,
  GroundGeometry:GroundGeometry,
  CubeGeometry:CubeGeometry,
  SphereGeometry:SphereGeometry,
  CylinderGeometry:CylinderGeometry,
  Material:Material,
  Texture:Texture,
  CubeTexture:CubeTexture,
  Vec2:Vec2,
  Vec3:Vec3,
  Quat:Quat,
  RGBAColor:RGBAColor,
  OrbitCameraControl:OrbitCameraControl,
  GLAttribute:GLAttribute,
  GLContext:GLContext,
}