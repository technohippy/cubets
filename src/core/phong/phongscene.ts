import { Scene } from "../scene.js";
import { PhongDirectionalLight } from "./phongdirectionallight.js";
import { PhongMaterial } from "./phongmaterial.js";
import { Renderer } from "../renderer.js";

export class PhongScene extends Scene {
  static Light = PhongDirectionalLight
  static Material = PhongMaterial

  getVertexPositionAttribLocation(renderer:Renderer): number {
    return renderer.getAttributeLocation("aVertexPosition")
  }

  getVertexNormalAttribLocation(renderer:Renderer): number {
    return renderer.getAttributeLocation("aVertexNormal")
  }

  getVertexTextureCoordsAttribLocation(renderer:Renderer): number {
    return renderer.getAttributeLocation("aVertexTextureCoords")
  }

  getProjectionMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null {
    return renderer.getUniformLocation("uProjectionMatrix")
  }

  getModelViewMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null{
    return renderer.getUniformLocation("uModelViewMatrix")
  }

  getNormalMatrixUniformLocation(renderer:Renderer): WebGLUniformLocation | null {
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
      names.push("uIgnoreTexture")
    }
    if (this.hasCubeTexture()) {
      names.push("uCubeSampler")
      names.push("uIgnoreCubeTexture")
      names.push("uSkybox")
    }
    return names
  }

  getVertexShader() {
    return `#version 300 es

      ${this.hasTexture() ? "#define TEXTURE" : ""}
      ${this.hasCubeTexture() ? "#define CUBETEXTURE" : ""}

      precision mediump float;
      precision mediump int;

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

      #ifdef CUBETEXTURE
      uniform int uSkybox;
      #endif

      out vec3 vNormal;
      out vec3 vEyeVector;
      out vec3 vLightNormal[numLights];
      out vec3 vLightVector[numLights];

      #ifdef TEXTURE
      out vec2 vTextureCoords;
      #endif

      #ifdef CUBETEXTURE
      out vec3 vSkyboxTextureCoords;
      #endif

      void main(void) {
        vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);

        vEyeVector = -vec3(vertex.xyz);
        vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
        for (int i = 0; i < numLights; i++) {
          if (0 < uPositionalLight[i]) {
            vec4 lightPosition = uModelViewMatrix * vec4(uLightPosition[i], 1.0);
            vLightVector[i] = vertex.xyz - lightPosition.xyz;
            vLightNormal[i] = vNormal - uLightDirection[i];
          } else {
            vLightVector[i] = (vec4(uLightDirection[i], 1.0) * inverse(uModelViewMatrix)).xyz;
            vLightNormal[i] = vNormal;
          }
        }

        #ifdef TEXTURE
        vTextureCoords = aVertexTextureCoords;
        #endif
        
        #ifdef CUBETEXTURE
        if (0 < uSkybox) {
          vSkyboxTextureCoords = aVertexPosition;
        }
        #endif

        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
      }
    `
  }

  getFragmentShader() {
    return `#version 300 es

      ${this.hasTexture() ? "#define TEXTURE" : ""}
      ${this.hasCubeTexture() ? "#define CUBETEXTURE" : ""}

      precision mediump float;
      precision mediump int;

      const int numLights = ${this.lights.length};

      uniform mat4 uModelViewMatrix;

      #ifdef TEXTURE
      uniform sampler2D uSampler;
      uniform int uIgnoreTexture;
      #endif

      #ifdef CUBETEXTURE
      uniform samplerCube uCubeSampler;
      uniform int uIgnoreCubeTexture;
      uniform int uSkybox;
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

      in vec3 vNormal;
      in vec3 vEyeVector;
      in vec3 vLightNormal[numLights];
      in vec3 vLightVector[numLights];

      #ifdef TEXTURE
      in vec2 vTextureCoords;
      #endif

      #ifdef CUBETEXTURE
      in vec3 vSkyboxTextureCoords;
      #endif

      out vec4 fragColor;

      void main(void) {
        if (0 < uNormalMode) {
          fragColor = vec4(vLightNormal[0], 1);
          return;
        }
        if (0 < uWireframeMode) {
          fragColor = uMaterialAmbient;
          return;
        }
        #ifdef CUBETEXTURE
        if (uIgnoreCubeTexture == 0 && 0 < uSkybox) {
          fragColor = texture(uCubeSampler, vSkyboxTextureCoords);
          return;
        }
        #endif

        fragColor = vec4(0.0, 0.0, 0.0, 1.0);

        for (int i = 0; i < numLights; i++) {
          vec3 L;
          if (0 < uLightFollowCameraMode[i]) {
            L = normalize(uLightDirection[i]);
          } else {
            L = normalize(vLightVector[i]);
          }
          vec3 N = normalize(vLightNormal[i]);
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
        if (uIgnoreTexture == 0) {
          fragColor = fragColor * texture(uSampler, vTextureCoords);
        }
        #endif

        #ifdef CUBETEXTURE
        if (uIgnoreCubeTexture == 0) {
          vec3 ref = reflect(-vEyeVector, vNormal);
          vec3 coords = (inverse(uModelViewMatrix) * vec4(ref, 1.0)).xyz;
          fragColor = fragColor * texture(uCubeSampler, coords);
        }
        #endif
      }
    `
  }
}