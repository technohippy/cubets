import { GLProgram } from "../../gl/glprogram.js";
import { GLBuffer } from "../../gl/glbuffer.js";
import { GLAttribute } from "../../gl/glattribute.js";
import { GLUniform } from "../../gl/gluniform.js";
import { GL2Renderer } from "../../gl/gl2renderer.js";
import { GLContext } from "../../gl/glcontext.js";
import { GLTexture } from "../../gl/gltexture.js";
import { GLTexture2D } from "../../gl/gltexture2d.js";
import { GLFramebuffer } from "../../gl/glframebuffer.js";

export abstract class Filter {
  program:GLProgram
  aPosition:GLAttribute
  aTexCoord:GLAttribute
  uImage:GLUniform
  context:GLContext

  constructor(fs:string) {
    const vs = `#version 300 es
      in vec2 a_position;
      in vec2 a_texCoord;

      out vec2 v_texCoord;

      void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = a_texCoord;
      }`
    this.program = new GLProgram(vs, fs)

    this.aPosition = new GLAttribute("a_position", 2, WebGL2RenderingContext.FLOAT)
    this.aPosition.buffer = GLBuffer.f32([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ])
    this.aTexCoord = new GLAttribute("a_texCoord", 2, WebGL2RenderingContext.FLOAT)
    this.aTexCoord.buffer = GLBuffer.f32([
      0,  0,
      1,  0,
      0,  1,
      0,  1,
      1,  0,
      1,  1,
    ])
    this.uImage = new GLUniform("u_image", "1i")

    this.context = new GLContext()
    this.context.add(this.aPosition, this.aTexCoord, this.uImage)
  }

  render(renderer:GL2Renderer, framebuffer:GLFramebuffer|null, texture:GLTexture2D) {
    this.context.framebuffer = framebuffer
    this.uImage.updateValue(texture)
    renderer.draw(this.program, this.context)
  }
}