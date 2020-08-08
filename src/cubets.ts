import { PhongScene } from "./core/phong/phongscene.js"
import { ShaderScene } from "./core/shaderscene.js"
import { Renderer } from "./core/renderer.js"
import { PhongDirectionalLight } from "./core/phong/phongdirectionallight.js"
import { PhongPositionalLight } from "./core/phong/phongpositionallight.js"
import { PhongSpotLight } from "./core/phong/phongspotlight.js"
import { Material } from "./core/material.js"
import { PhongReflectionMaterial } from "./core/phong/phongreflectionmaterial.js"
import { Mesh } from "./core/mesh.js"
import { InstancedMesh } from "./core/instancedmesh.js"
import { Particles } from "./core/particles.js"
import { Viewport } from "./core/viewport.js"
import { Texture, TextureType } from "./core/texture.js"
import { CubeTexture } from "./core/cubetexture.js"

import { PerspectiveCamera } from "./camera/perspectivecamera.js"
import { OrthogonalCamera } from "./camera/orthogonalcamera.js"
import { ShaderCamera } from "./camera/shadercamera.js"

import { PlaneGeometry } from "./geometry/planegeometry.js"
import { GroundGeometry } from "./geometry/groundgeometry.js"
import { CubeGeometry } from "./geometry/cubegeometry.js"
import { SphereGeometry } from "./geometry/spheregeometry.js"
import { CylinderGeometry } from "./geometry/cylindergeometry.js"

import { Filter } from "./core/filter.js"
import { FilterMaterial } from "./core/filter/filtermaterial.js"
import { FilterScene } from "./core/filter/filterscene.js"
import { GrayscaleFilter } from "./filter/grayscalefilter.js"
import { InvertFilter } from "./filter/invertfilter.js"
import { BlurFilter } from "./filter/blurfilter.js"

import { OrbitCameraControl } from "./control/orbitcameracontrol.js"
import { Picker } from "./core/picker.js"

import { Vec2 } from "./math/vec2.js"
import { Vec3 } from "./math/vec3.js"
import { Quat } from "./math/quat.js"
import { RGBAColor } from "./math/rgbacolor.js"

import { Axis } from "./misc/axis.js"
import { Fog } from "./core/fog.js"

import { JSONGeometryLoader } from "./misc/jsongeometryloader.js"
import { OBJGeometryLoader } from "./misc/objgeometryloader.js"

import { GL2Renderer } from "./gl/gl2renderer.js"
import { GLProgram } from "./gl/glprogram.js"
import { GLAttribute } from "./gl/glattribute.js"
import { GLUniform, GLUniformI1, GLUniformF1, GLUniformF2, GLUniformFv1 } from "./gl/gluniform.js"
import { GLImage } from "./gl/glimage.js"
import { GLTexture } from "./gl/gltexture.js"
import { GLBuffer } from "./gl/glbuffer.js"
import { GLContext } from "./gl/glcontext.js"
import { GLFramebuffer } from "./gl/glframebuffer.js"

export default {
  Scene: PhongScene,
  PhongScene: PhongScene,
  ShaderScene: ShaderScene,

  Material: Material,
  PhongReflectionMaterial: PhongReflectionMaterial,
  Mesh: Mesh,
  InstancedMesh: InstancedMesh,
  Particles: Particles,
  Renderer: Renderer,

  PerspectiveCamera: PerspectiveCamera, 
  OrthogonalCamera: OrthogonalCamera,
  ShaderCamera: ShaderCamera,

  OrbitCameraControl: OrbitCameraControl,
  Picker: Picker,

  PhongPositionalLight: PhongPositionalLight,
  PhongDirectionalLight: PhongDirectionalLight,
  PhongSpotLight: PhongSpotLight,

  PlaneGeometry: PlaneGeometry,
  GroundGeometry: GroundGeometry,
  CubeGeometry: CubeGeometry,
  SphereGeometry: SphereGeometry,
  CylinderGeometry: CylinderGeometry,

  Filter: Filter,
  FilterScene: FilterScene,
  FilterMaterial: FilterMaterial,

  GrayscaleFilter: GrayscaleFilter,
  InvertFilter: InvertFilter,
  BlurFilter: BlurFilter,

  Viewport: Viewport,
  Texture: Texture,
  TextureType: TextureType,
  CubeTexture: CubeTexture,

  Vec2: Vec2,
  Vec3: Vec3,
  Quat: Quat,
  RGBAColor: RGBAColor,
  Color: RGBAColor,

  Axis: Axis,
  JSONGeometryLoader: JSONGeometryLoader,
  OBJGeometryLoader: OBJGeometryLoader,
  Fog: Fog,

  GL2Renderer: GL2Renderer,
  GLProgram: GLProgram,
  GLAttribute: GLAttribute,
  GLUniform: GLUniform,
  GLUniformI1: GLUniformI1,
  GLUniformF1: GLUniformF1,
  GLUniformF2: GLUniformF2,
  GLUniformFv1: GLUniformFv1,
  GLImage: GLImage,
  GLTexture: GLTexture,
  GLBuffer: GLBuffer,
  GLContext: GLContext,
  GLFramebuffer: GLFramebuffer,

  GL: WebGLRenderingContext,
  GL2: WebGL2RenderingContext,
}
