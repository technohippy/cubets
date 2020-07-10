import { Scene } from "../scene.js";
import { PhongLight } from "./phonglight.js";
import { PhongMaterial } from "./phongmaterial.js";

export class PhongScene extends Scene {
  static Light = PhongLight
  static Material = PhongMaterial

  constructor() {
    super(PhongScene.vertexShader, PhongScene.fragmentShader)
  }

  getVertexPositionAttribLocation(): number {
    return this.getAttributeLocation("aVertexPosition")
  }

  getVertexNormalAttribLocation(): number {
    return this.getAttributeLocation("aVertexNormal")
  }

  getProjectionMatrixUniformLocation(): WebGLUniformLocation {
    return this.getUniformLocation("uProjectionMatrix")
  }

  getModelViewMatrixUniformLocation(): WebGLUniformLocation {
    return this.getUniformLocation("uModelViewMatrix")
  }

  getNormalMatrixUniformLocation(): WebGLUniformLocation {
    return this.getUniformLocation("uNormalMatrix")
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
    ]
  }

  getUniformNames(): string[] {
    return [
      "uModelViewMatrix",
      "uProjectionMatrix",
      "uNormalMatrix",
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

    in vec3 aVertexPosition;
    in vec3 aVertexNormal;

    out vec3 vNormal;
    out vec3 vEyeVector;

    void main(void) {
      vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);

      vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
      vEyeVector = -vec3(vertex.xyz);
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    }
  `
  static fragmentShader = `#version 300 es
    precision mediump float;

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

    out vec4 fragColor;

    void main(void) {
      vec3 L = normalize(uLightDirection);
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
    }
  `
}