import { ShaderScene } from "../shaderscene.js"
import { Renderer } from "../renderer.js"

export class FilterScene extends ShaderScene {
  hasTexture(): boolean {
    return true
  }

  // overridable
  getVertexTextureCoordsAttribLocation(renderer:Renderer): number { 
    return renderer.getAttributeLocation("aVertexTextureCoords")
  }

  // overridable
  getAttributeNames(): string[] {
    return ["aVertexTextureCoords", ...super.getAttributeNames()]
  }

  // overridable
  getUniformNames(): string[] {
    return [ "uSampler", ...super.getUniformNames() ]
  }

  getVertexShader():string {
    return super.getVertexShader({
      declare:`
        in vec2 aVertexTextureCoords;
      `,
      mainBody:`
        vTextureCoords = aVertexTextureCoords;
      `,
    })
  }

  getFragmentShaderHead():string {
    return super.getFragmentShaderHead({declare:`
      uniform sampler2D uSampler;
      in vec2 vTextureCoords;
    `})
  }

  getFragmentShaderBody(fragColor:string, frameColor:string):string {
    if (this.fragmentShaderBodyFn) {
      const body = this.fragmentShaderBodyFn(fragColor, frameColor)
      if (0 <= body.search(/\s*void\s+main\s*\(/g)) {
        return body
      } else {
        return `
          vec4 frameColor = texture(uSampler, vTextureCoords);
          ${body}
        `
      }

    }
    throw "subclass responsibility"
  }
}