import { Scene } from "./scene.js"
import { GeometryConfig } from "./geometry.js"
import { GLAttribute } from "../gl/glattribute.js"
import { Material } from "./material.js"
import { Camera } from "./camera.js"
import { Light } from "./light.js"
import { PhongMaterial } from "./phongmaterial.js"
import { GLUniform } from "../gl/gluniform.js"
import { PhongDirectionalLight } from "./phongdirectionallight.js"
import { PhongPositionalLight } from "./phongpositionallight.js";
import { PhongSpotLight } from "./phongspotlight.js";
import { PhongPerspectiveCamera } from "./phongperspecivecamera.js"
import { PhongOrthogonalCamera } from "./phongorthogonalcamera.js"
import { RGBAColor } from "../math/rgbacolor.js"

const GL = WebGL2RenderingContext

export class PhongScene extends Scene {
  hasParticles():boolean {
    return false // TODO
  }

  hasTexture():boolean {
    const texturedMesh = this.meshes.find(m => m.material?.texture)
    if (texturedMesh) {
      return true
    } else {
      return false
    }
  }

  hasNormalTexture():boolean {
    return false // TODO
  }

  hasCubeTexture():boolean {
    const texturedMesh = this.meshes.find(m => m.material?.cubeTexture)
    if (texturedMesh) {
      return true
    } else {
      return false
    }
  }

  hasVertexColor():boolean {
    const vertexColoredMesh = this.meshes.find(m => {
      if (m.geometry) {
        return 0 < m.geometry.colors.length
      } else {
        return false
      }
    })
    if (vertexColoredMesh) {
      return true
    } else {
      return false
    }
  }

  clone():Scene {
    const scene = new PhongScene()
    scene.meshes = this.meshes
    scene.lights = this.lights
    return scene
  }

  createMaterial(params?:{[key:string]:any}):Material {
    let diffuse = RGBAColor.random()
    let ambient = RGBAColor.Gray
    let specular = RGBAColor.White
    if (params) {
      if (params["diffuseColor"]) diffuse = params["diffuseColor"]
      if (params["ambientColor"]) ambient = params["ambientColor"]
      if (params["specularColor"]) specular = params["specularColor"]
    }
    return new PhongMaterial(diffuse, ambient, specular)
  }

  createLight(params:{[key:string]:any}):Light {
    if (params["type"] === "directional") {
      const light = new PhongDirectionalLight(
        params["direction"],
        params["diffuseColor"],
        params["ambientColor"],
        params["specularColor"],
      )
      light.shouldFollowCamera = !!params["followCamera"]
      return light

    } else if (params["type"] === "positional") {
      const light = new PhongPositionalLight(
        params["position"],
        params["diffuseColor"],
        params["ambientColor"],
        params["specularColor"],
      )
      light.shouldFollowCamera = !!params["followCamera"]
      return light

    } else if (params["type"] === "spot") {
      const light = new PhongSpotLight(
        params["position"],
        params["direction"],
        params["diffuseColor"],
        params["ambientColor"],
        params["specularColor"],
      )
      light.shouldFollowCamera = !!params["followCamera"]
      return light
    }

    throw `invalid light type:${params["type"]}`
  }

  createCamera(params:{[key:string]:any}):Camera {
    if (params["type"] === "perspective") {
      return new PhongPerspectiveCamera(
        params["fov"],
        params["near"],
        params["far"],
      )
    } else if (params["type"] === "orthogonal") {
      return new PhongOrthogonalCamera(
        params["width"],
        params["near"],
        params["far"],
      )
    }
    throw `invalid type:${params["type"]}`
  }

  getVertexShader():string {
    return `#version 300 es

      ${this.hasParticles() ? "#define PARTICLES" : ""}
      ${this.hasTexture() ? "#define TEXTURE" : ""}
      ${this.hasNormalTexture() ? "#define NORMALTEXTURE" : ""}
      ${this.hasCubeTexture() ? "#define CUBETEXTURE" : ""}
      ${this.hasVertexColor() ? "#define VERTEXCOLOR" : ""}

      precision mediump float;
      precision mediump int;

      const int numLights = ${this.lights.length === 0 ? 1 : this.lights.length};

      uniform bool uVertexColorMode;

      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;
      uniform mat4 uNormalMatrix;

      uniform int uPositionalLight[numLights];
      uniform vec3 uLightPosition[numLights];
      uniform vec3 uLightDirection[numLights];

      in vec3 aVertexPosition;
      in vec3 aVertexNormal;
      #ifdef VERTEXCOLOR
      in vec4 aVertexColor;
      #endif

      // for instance
      in vec3 aVertexOffset;
      in vec4 aVertexQuat;

      #ifdef NORMALTEXTURE
      in vec3 aVertexTangent;
      #endif

      #if defined(TEXTURE) || defined(NORMALTEXTURE)
      in vec2 aVertexTextureCoords;
      #endif

      #ifdef CUBETEXTURE
      uniform bool uSkybox;
      #endif

      #ifdef PARTICLES
      uniform bool uParticles;
      uniform float uPointSize;
      #endif

      out vec3 vNormal;
      out vec3 vEyeVector;
      out vec3 vLightNormal[numLights];
      out vec3 vLightVector[numLights];
      out float vDepth;

      #ifdef VERTEXCOLOR
      out vec4 vVertexColor;
      #endif

      #if defined(TEXTURE) || defined(NORMALTEXTURE)
      out vec2 vTextureCoords;
      #endif

      #ifdef CUBETEXTURE
      out vec3 vSkyboxTextureCoords;
      #endif

      void main(void) {
        vec4 modelVertex = vec4(aVertexPosition, 1.0);
        vec4 normal = vec4(aVertexNormal, 1.0);
        if (0.0 < length(aVertexQuat)) {
          vec4 q = aVertexQuat;
          // http://marupeke296.sakura.ne.jp/DXG_No58_RotQuaternionTrans.html
          mat4 matrix = mat4(
            1.-2.*q.y*q.y-2.*q.z*q.z,    2.*q.x*q.y+2.*q.w*q.z,    2.*q.x*q.z-2.*q.w*q.y, 0.,
               2.*q.x*q.y-2.*q.w*q.z, 1.-2.*q.x*q.x-2.*q.z*q.z,    2.*q.y*q.z+2.*q.w*q.x, 0.,
               2.*q.x*q.z+2.*q.w*q.y,    2.*q.y*q.z-2.*q.w*q.x, 1.-2.*q.x*q.x-2.*q.y*q.y, 0.,
                                  0.,                       0.,                       0., 1.
          );
          //modelVertex = matrix * modelVertex;
          //normal = matrix * normal;
          modelVertex = modelVertex * matrix;
          normal = normal * matrix;
        }
        modelVertex = modelVertex + vec4(aVertexOffset, 0.0);
        vec4 vertex = uModelViewMatrix * modelVertex;

        vNormal = vec3(uNormalMatrix * normal);

        #ifdef NORMALTEXTURE
        vec3 tangent = vec3(uNormalMatrix * vec4(aVertexTangent, 1.0));
        vec3 bitangent = cross(vNormal, tangent);
        mat3 tbnMatrix = mat3(
          tangent.x, bitangent.x, vNormal.x,
          tangent.y, bitangent.y, vNormal.y,
          tangent.z, bitangent.z, vNormal.z
        );
        #endif

        vEyeVector = -vec3(vertex.xyz);
        #ifdef NORMALTEXTURE
        vEyeVector = vEyeVector * tbnMatrix;
        #endif

        for (int i = 0; i < numLights; i++) {
          if (0 < uPositionalLight[i]) {
            vec4 lightPosition = uModelViewMatrix * vec4(uLightPosition[i], 1.0);
            vLightVector[i] = vertex.xyz - lightPosition.xyz;
            vLightNormal[i] = vNormal - uLightDirection[i];
          } else {
            vLightVector[i] = (vec4(uLightDirection[i], 1.0) * inverse(uModelViewMatrix)).xyz;
            vLightNormal[i] = vNormal;
          }
          #ifdef NORMALTEXTURE
          vLightVector[i] = vLightVector[i] * tbnMatrix;
          vLightNormal[i] = vLightNormal[i] * tbnMatrix;
          #endif
        }

        #if defined(TEXTURE) || defined(NORMALTEXTURE)
        vTextureCoords = aVertexTextureCoords;
        #endif
        
        #ifdef CUBETEXTURE
        if (uSkybox) {
          vSkyboxTextureCoords = modelVertex.xyz;
        }
        #endif

        #ifdef VERTEXCOLOR
        if (uVertexColorMode) {
          vVertexColor = aVertexColor;
        }
        #endif

        vDepth = -vertex.z;

        gl_Position = uProjectionMatrix * vertex;

        #ifdef PARTICLES
        if (uParticles) {
          gl_PointSize = uPointSize;
        }
        #endif
      }
    `
  }
 
  getFragmentShader():string {
    return `#version 300 es

      ${this.hasParticles() ? "#define PARTICLES" : ""}
      ${this.hasTexture() ? "#define TEXTURE" : ""}
      ${this.hasNormalTexture() ? "#define NORMALTEXTURE" : ""}
      ${this.hasCubeTexture() ? "#define CUBETEXTURE" : ""}
      ${this.hasVertexColor() ? "#define VERTEXCOLOR" : ""}

      precision mediump float;
      precision mediump int;

      const int numLights = ${this.lights.length === 0 ? 1 : this.lights.length};

      uniform mat4 uModelViewMatrix;

      #ifdef TEXTURE
      uniform sampler2D uSampler;
      uniform int uIgnoreTexture;
      #endif

      #ifdef NORMALTEXTURE
      uniform sampler2D uNormalSampler;
      uniform int uIgnoreNormalTexture;
      #endif

      #ifdef CUBETEXTURE
      uniform samplerCube uCubeSampler;
      uniform bool uIgnoreCubeTexture;
      uniform bool uSkybox;
      #endif

      // flags
      uniform bool uNormalMode;
      uniform bool uWireframeMode;
      uniform bool uVertexColorMode;
      uniform bool uIgnoreLightingMode;

      #ifdef PARTICLES
      uniform bool uParticles;
      #endif

      // fog
      uniform bool uUseFog;
      uniform float uFogNear;
      uniform float uFogFar;
      uniform vec4 uFogColor;

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
      in float vDepth;
      
      #ifdef VERTEXCOLOR
      in vec4 vVertexColor;
      #endif

      #if defined(TEXTURE) || defined(NORMALTEXTURE)
      in vec2 vTextureCoords;
      #endif

      #ifdef CUBETEXTURE
      in vec3 vSkyboxTextureCoords;
      #endif

      out vec4 fragColor;

      void main(void) {
        // special cases
        #ifdef PARTICLES
        if (uParticles) {
          fragColor = texture(uSampler, gl_PointCoord);
          return;
        }
        #endif

        if (uNormalMode) {
          fragColor = vec4(vLightNormal[0], 1);
          return;
        }

        if (uWireframeMode) {
          #ifdef VERTEXCOLOR
          if (uVertexColorMode) {
            fragColor = vVertexColor;
            return;
          }
          #endif

          fragColor = uMaterialAmbient;
          return;
        }

        #ifdef VERTEXCOLOR
        if (uVertexColorMode) {
          fragColor = vVertexColor;
          return;
        }
        #endif

        if (uIgnoreLightingMode) {
          fragColor = uMaterialDiffuse;
          return;
        }

        #ifdef CUBETEXTURE
        if (!uIgnoreCubeTexture && uSkybox) {
          fragColor = texture(uCubeSampler, vSkyboxTextureCoords);
          return;
        }
        #endif

        // phong coloring
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);

        for (int i = 0; i < numLights; i++) {
          vec3 L;
          if (0 < uLightFollowCameraMode[i]) {
            L = normalize(uLightDirection[i]);
          } else {
            L = normalize(vLightVector[i]);
          }
          vec3 normal = vLightNormal[i];
          #ifdef NORMALTEXTURE
          if (uIgnoreNormalTexture == 0) {
            normal = 2.0 * texture(uNormalSampler, vTextureCoords).rgb - 1.0;
          }
          #endif
          vec3 N = normalize(normal);
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
          /*
          float th = 0.0000001;
          if (fragColor.r < th && fragColor.g < th && fragColor.b < th && 0.9 < fragColor.a) {
            fragColor.r = 1.0;
          }
          */
        }

        #ifdef TEXTURE
        if (uIgnoreTexture == 0) {
          fragColor = fragColor * texture(uSampler, vTextureCoords);
        }
        #endif

        #ifdef CUBETEXTURE
        if (!uIgnoreCubeTexture) {
          vec3 ref = reflect(-vEyeVector, vNormal);
          vec3 coords = (inverse(uModelViewMatrix) * vec4(ref, 1.0)).xyz;
          fragColor = fragColor * texture(uCubeSampler, coords);
        }
        #endif

        if (uUseFog) {
          float fogAmount = smoothstep(uFogNear, uFogFar, vDepth);
          fragColor = mix(fragColor, uFogColor, fogAmount);  
        }
      }
    `
  }

  geometryConfig():GeometryConfig {
    const config:GeometryConfig = {
      "vertices":new GLAttribute("aVertexPosition", 3, GL.FLOAT),
      "normals":new GLAttribute("aVertexNormal", 3, GL.FLOAT),
      //"offsets":new GLAttribute("aVertexOffset", 3, GL.FLOAT),
      //"quats":new GLAttribute("aVertexQuat", 4, GL.FLOAT),
    }
    if (this.hasTexture()) {
      config["uvs"] = new GLAttribute("aVertexTextureCoords", 2, GL.FLOAT)
    }
    if (this.hasVertexColor()) {
      config["colors"] = new GLAttribute("aVertexColor", 4, GL.FLOAT)
      config["useVertexColor"] = new GLUniform("uVertexColorMode", "1i")
    }
    return config
  }

  materialConfig():{[key:string]:GLUniform} {
    const config:{[key:string]:GLUniform} = {
      "wireframe":new GLUniform("uWireframeMode", "1i"),
      "normal":new GLUniform("uNormalMode", "1i"),
      "diffuse":new GLUniform("uMaterialDiffuse", "4f"),
      "ambient":new GLUniform("uMaterialAmbient", "4f"),
      "specular":new GLUniform("uMaterialSpecular", "4f"),
      "shininess":new GLUniform("uShininess", "1f"),
    }
    if (this.hasTexture()) {
      config["texture"] = new GLUniform("uSampler", "1i")
      config["skipTexture"] = new GLUniform("uIgnoreTexture", "1i")
    }
    if (this.hasCubeTexture()) {
      config["skybox"] = new GLUniform("uSkybox", "1i")
      config["cubeTexture"] = new GLUniform("uCubeSampler", "1i")
      config["skipCubeTexture"] = new GLUniform("uIgnoreCubeTexture", "1i")
    }
    return config
  }
  
  lightConfig():{[key:string]:GLUniform} {
    return {
      "isPositional":new GLUniform("uPositionalLight", "1iv"),
      "followCamera":new GLUniform("uLightFollowCameraMode", "1iv"),
      "direction":new GLUniform("uLightDirection", "3fv"),
      "position":new GLUniform("uLightPosition", "3fv"),
      "ambient":new GLUniform("uLightAmbient", "4fv"),
      "diffuse":new GLUniform("uLightDiffuse", "4fv"),
      "specular":new GLUniform("uLightSpecular", "4fv"),
      "cutoff":new GLUniform("uCutoff", "1fv"),
    }
  }

  cameraConfig():{[key:string]:GLUniform} {
    return {
      "projectionMatrix":new GLUniform("uProjectionMatrix", "m4fv"),
      "modelViewMatrix":new GLUniform("uModelViewMatrix", "m4fv"),
      "normalMatrix":new GLUniform("uNormalMatrix", "m4fv"),
    }
  }
}