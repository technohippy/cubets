export class Material {
  vsCode: string
  fsCode: string
  program?: WebGLProgram
  attributeLocations = new Map<string, number>()
  uniformLocations = new Map<string, WebGLUniformLocation>()

  constructor() {
    this.vsCode = `#version 300 es
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
    this.fsCode = `#version 300 es
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

        //fragColor = vec4(vec3(Ia + Id + Is), 1.0);
        fragColor = vec4(1.0, 0.0, 0.0, 1.0);
      }
    `
  }

  setup(gl: WebGL2RenderingContext) {
    const vs = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vs, this.vsCode)
    gl.compileShader(vs)
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vs))
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fs, this.fsCode)
    gl.compileShader(fs)
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fs))
    }

    this.program = gl.createProgram()!
    gl.attachShader(this.program, vs)
    gl.attachShader(this.program, fs)
    gl.linkProgram(this.program)
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw("fail to initialize shaders")
    }
    gl.useProgram(this.program)

    this.setupLocations(gl)
  }

  setupLocations(gl: WebGL2RenderingContext) {
    [
      "aVertexPosition",
      "aVertexNormal",
    ].forEach(attrName => {
      this.attributeLocations.set(attrName, gl.getAttribLocation(this.program!, attrName))
    });
    [
      "uModelViewMatrix",
      "uProjectionMatrix",
      "uNormalMatrix",
      /*
      "uShininess",
      "uLightDirection",
      "uLightAmbient",
      "uLightDiffuse",
      "uLightSpecular",
      "uMaterialAmbient",
      "uMaterialDiffuse",
      "uMaterialSpecular",
      */
    ].forEach(uniName => {
      const loc = gl.getUniformLocation(this.program!, uniName)
      if (loc === null) {
        throw `fail to get uniform location: ${uniName}`
      }
      this.uniformLocations.set(uniName, loc)
    });
  }

  getUniformLocation(name: string): WebGLUniformLocation {
    const loc = this.uniformLocations.get(name)
    if (loc === undefined) {
      throw `uniform not found: ${name}`
    }
    return loc as WebGLUniformLocation
  }
}