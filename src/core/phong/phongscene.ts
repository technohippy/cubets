import { Scene } from "../scene.js";
import { PhongDirectionalLight } from "./phongdirectionallight.js";
import { PhongMaterial } from "./phongmaterial.js";
import { Renderer } from "../renderer.js";

export class PhongScene extends Scene {
  static Light = PhongDirectionalLight
  static Material = PhongMaterial

  constructor() {
    super(PhongScene.vertexShader, PhongScene.fragmentShader)
  }

  getVertexPositionAttribLocation(renderer:Renderer): number {
    return renderer.getAttributeLocation("aVertexPosition")
  }

  getVertexNormalAttribLocation(renderer:Renderer): number {
    return renderer.getAttributeLocation("aVertexNormal")
  }

  getVertexTextureCoordsAttribLocation(renderer:Renderer): number {
    return renderer.getAttributeLocation("aVertexTextureCoords")
  }

  getProjectionMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation {
    return renderer.getUniformLocation("uProjectionMatrix")
  }

  getModelViewMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation {
    return renderer.getUniformLocation("uModelViewMatrix")
  }

  getNormalMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation {
    return renderer.getUniformLocation("uNormalMatrix")
  }

  modelViewMatrixName(): string {
    return "uModelViewMatrix"
  }

  projectionMatrixName(): string {
    return "uProjectionMatrix"
  }

  normalMatrixName(): string {
    return "uNormalMatrix"
  }

  getAttributeNames(): string[] {
    return [
      "aVertexPosition",
      "aVertexNormal",
      "aVertexTextureCoords",
    ]
  }

  getUniformNames(): string[] {
    return [
      "uModelViewMatrix",
      "uProjectionMatrix",
      "uNormalMatrix",
      "uWireframeMode",
      "uNormalMode",
      "uLightFollowCameraMode",
      "uSampler",
      "uShininess",
      "uLightDirection",
      "uLightAmbient",
      "uLightDiffuse",
      "uLightSpecular",
      "uMaterialAmbient",
      "uMaterialDiffuse",
      "uMaterialSpecular",
    ]
  }

  static vertexShader = `#version 300 es
    precision mediump float;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uNormalMatrix;

    uniform vec3 uLightDirection;

    in vec3 aVertexPosition;
    in vec3 aVertexNormal;
    in vec2 aVertexTextureCoords;

    out vec3 vNormal;
    out vec3 vEyeVector;
    out vec3 vLightVector;
    out vec2 vTextureCoords;

    void main(void) {
      vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);

      vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
      vEyeVector = -vec3(vertex.xyz);
      vLightVector = (vec4(uLightDirection, 1.0) * inverse(uModelViewMatrix)).xyz;
      vTextureCoords = aVertexTextureCoords;
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    }
  `
  static fragmentShader = `#version 300 es
    precision mediump float;

    uniform mat4 uModelViewMatrix;
    uniform sampler2D uSampler;

    uniform int uNormalMode;
    uniform int uWireframeMode;
    uniform int uLightFollowCameraMode;

    uniform float uShininess;
    uniform vec3 uLightDirection;
    uniform vec4 uLightAmbient;
    uniform vec4 uLightDiffuse;
    uniform vec4 uLightSpecular;
    uniform vec4 uMaterialAmbient;
    uniform vec4 uMaterialDiffuse;
    uniform vec4 uMaterialSpecular;

    in vec3 vNormal;
    in vec3 vEyeVector;
    in vec3 vLightVector;
    in vec2 vTextureCoords;

    out vec4 fragColor;

    void main(void) {
      if (0 < uNormalMode) {
        fragColor = vec4(vNormal, 1);
        return;
      }
      if (0 < uWireframeMode) {
        fragColor = uMaterialAmbient;
        return;
      }

      vec3 L;
      if (0 < uLightFollowCameraMode) {
        L = normalize(uLightDirection);
      } else {
        L = normalize(vLightVector);
      }
      vec3 N = normalize(vNormal);
      float lambertTerm = dot(N, -L);
      vec4 Ia = uLightAmbient * uMaterialAmbient;
      vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
      vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

      if (lambertTerm > 0.0) {
        Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;

        vec3 E = normalize(vEyeVector);
        vec3 R = reflect(L, N);
        float specular = pow(max(dot(R, E), 0.0), uShininess);
        Is = uLightSpecular * uMaterialSpecular * specular;
      }

      fragColor = vec4(vec3(Ia + Id + Is), 1.0);
      fragColor = fragColor * texture(uSampler, vTextureCoords);
    }
  `
}