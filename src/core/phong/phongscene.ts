import { Scene } from "../scene.js";
import { PhongDirectionalLight } from "./phongdirectionallight.js";
import { PhongMaterial } from "./phongmaterial.js";
import { Renderer } from "../renderer.js";

export class PhongScene extends Scene {
  static Light = PhongDirectionalLight
  static Material = PhongMaterial

  constructor(name="phone scene") {
    super(name)
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
    const names = [
      "aVertexPosition",
      "aVertexNormal",
    ]
    if (this.hasTexture()) {
      names.push("aVertexTextureCoords")
    }
    return names
  }

  getUniformNames(): string[] {
    const names = [
      "uModelViewMatrix",
      "uProjectionMatrix",
      "uNormalMatrix",
      "uWireframeMode",
      "uNormalMode",
      "uLightFollowCameraMode",
      "uShininess",
      "uPositionalLight",
      "uLightPosition",
      "uLightDirection",
      "uLightAmbient",
      "uLightDiffuse",
      "uLightSpecular",
      "uCutoff",
      "uMaterialAmbient",
      "uMaterialDiffuse",
      "uMaterialSpecular",
    ]
    if (this.hasTexture()) {
      names.push("uSampler")
    }
    return names
  }

  getVertexShader() {
    return `#version 300 es
      ${this.hasTexture() ? "#define TEXTURE" : ""}
      precision mediump float;

      const int numLights = ${this.lights.length};

      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      uniform mat4 uNormalMatrix;

      uniform int uPositionalLight[numLights];
      uniform vec3 uLightPosition[numLights];
      uniform vec3 uLightDirection[numLights];

      in vec3 aVertexPosition;
      in vec3 aVertexNormal;

      #ifdef TEXTURE
      in vec2 aVertexTextureCoords;
      #endif

      out vec3 vNormal[numLights];
      out vec3 vEyeVector;
      out vec3 vLightVector[numLights];

      #ifdef TEXTURE
      out vec2 vTextureCoords;
      #endif

      void main(void) {
        vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);

        vEyeVector = -vec3(vertex.xyz);
        for (int i = 0; i < numLights; i++) {
          vNormal[i] = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
          if (0 < uPositionalLight[i]) {
            vec4 lightPosition = uModelViewMatrix * vec4(uLightPosition[i], 1.0);
            vLightVector[i] = vertex.xyz - lightPosition.xyz;
            vNormal[i] = vNormal[i] - uLightDirection[i];
          } else {
            vLightVector[i] = (vec4(uLightDirection[i], 1.0) * inverse(uModelViewMatrix)).xyz;
          }
        }

        #ifdef TEXTURE
        vTextureCoords = aVertexTextureCoords;
        #endif

        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
      }
    `
  }

  getFragmentShader() {
    return `#version 300 es
      ${this.hasTexture() ? "#define TEXTURE" : ""}
      precision mediump float;

      const int numLights = ${this.lights.length};

      uniform mat4 uModelViewMatrix;

      #ifdef TEXTURE
      uniform sampler2D uSampler;
      #endif

      // flags
      uniform int uNormalMode;
      uniform int uWireframeMode;

      // light
      uniform int uLightFollowCameraMode[numLights];
      uniform vec3 uLightDirection[numLights];
      uniform vec4 uLightAmbient[numLights];
      uniform vec4 uLightDiffuse[numLights];
      uniform vec4 uLightSpecular[numLights];
      uniform float uCutoff[numLights];

      // material
      uniform float uShininess;
      uniform vec4 uMaterialAmbient;
      uniform vec4 uMaterialDiffuse;
      uniform vec4 uMaterialSpecular;

      in vec3 vNormal[numLights];
      in vec3 vEyeVector;
      in vec3 vLightVector[numLights];

      #ifdef TEXTURE
      in vec2 vTextureCoords;
      #endif

      out vec4 fragColor;

      void main(void) {
        if (0 < uNormalMode) {
          fragColor = vec4(vNormal[0], 1);
          return;
        }
        if (0 < uWireframeMode) {
          fragColor = uMaterialAmbient;
          return;
        }

        fragColor = vec4(0.0, 0.0, 0.0, 1.0);

        for (int i = 0; i < numLights; i++) {
          vec3 L;
          if (0 < uLightFollowCameraMode[i]) {
            L = normalize(uLightDirection[i]);
          } else {
            L = normalize(vLightVector[i]);
          }
          vec3 N = normalize(vNormal[i]);
          float lambertTerm = dot(N, -L);
          vec4 Ia = uLightAmbient[i] * uMaterialAmbient;
          vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
          vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

          if (lambertTerm > 0.0) {
            Id = uLightDiffuse[i] * uMaterialDiffuse * pow(lambertTerm, uCutoff[i]);

            vec3 E = normalize(vEyeVector);
            vec3 R = reflect(L, N);
            float specular = pow(max(dot(R, E), 0.0), uShininess);
            Is = uLightSpecular[i] * uMaterialSpecular * specular;
          }

          fragColor = fragColor + vec4(vec3(Ia + Id + Is), 1.0);
        }
        #ifdef TEXTURE
        fragColor = fragColor * texture(uSampler, vTextureCoords);
        #endif
      }
    `
  }
}