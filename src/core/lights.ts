import { Light } from "./light.js";
import { Renderer } from "./renderer.js";

export class Lights {
  lights: Light[] = []

  setupGLVars(renderer:Renderer) {
    const types = new Map<WebGLUniformLocation, string>()
    const values = new Map<WebGLUniformLocation, any[]>()
    this.forEach(l => {
      const vars = l.getGLVars(renderer)
      vars.forEach(v => {
        types.set(v.loc, v.type)
        if (!values.has(v.loc)) {
          values.set(v.loc, [])
        }
        if (Array.isArray(v.value)) {
          values.get(v.loc)!.push(...v.value)
        } else {
          values.get(v.loc)!.push(v.value)
        }
      })
    })

    const gl = renderer.gl
    values.forEach((val, loc) => {
      switch (types.get(loc)) {
        case "1i":
          gl.uniform1iv(loc, val)
          break;
        case "1f":
          gl.uniform1fv(loc, val)
          break;
        case "3f":
          if (val.length % 3 !== 0) {
            throw `invalid value: ${val}`
          }
          gl.uniform3fv(loc, val)
          break;
        case "4f":
          if (val.length % 4 !== 0) {
            throw `invalid value: ${val}`
          }
          gl.uniform4fv(loc, val)
          break;
        default:
          throw `unknown type: ${types.get(loc)}`
      }
    })
  }

  get length(): number {
    return this.lights.length;
  }

  push(light: Light) {
    this.lights.push(light)
  }

  forEach(fn: (l:Light, i?:number) => void) {
    this.lights.forEach(fn)
  }
}