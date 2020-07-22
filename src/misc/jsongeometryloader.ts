import { Geometry } from "../core/geometry.js";
import { Vec2 } from "../math/vec2.js";
import { Vec3 } from "../math/vec3.js";
import { Face3 } from "../math/face3.js";
import { RGBAColor } from "../math/rgbacolor.js";

export class JSONGeometryLoader {
  static load(url:string): Promise<Geometry> {
    const loader = new JSONGeometryLoader()
    return loader.load(url)
  }

  load(url:string): Promise<Geometry> {
    return fetch(url).then(resp => resp.json()).then((json:any) => {
      const geometry = new Geometry()
      if (!json.vertices) throw 'invalid json: vertices is mandatory'
      if (!json.indices) throw 'invalid json: indices is mandatory'

      for (let i = 0; i < json.vertices.length; i += 3) {
        geometry.vertices.push(new Vec3(
          json.vertices[i],
          json.vertices[i+1],
          json.vertices[i+2],
        ))
      }

      for (let i = 0; i < json.indices.length; i += 3) {
        geometry.indices.push(new Face3(
          json.indices[i],
          json.indices[i+1],
          json.indices[i+2],
        ))
      }
      
      if (json.normals) {
        for (let i = 0; i < json.normals.length; i += 3) {
          geometry.normals.push(new Vec3(
            json.normals[i],
            json.normals[i+1],
            json.normals[i+2],
          ))
        }
      } else {
        geometry.computeNormals()
      }

      if (json.uvs) {
        for (let i = 0; i < json.uvs.length; i += 2) {
          geometry.uvs.push(new Vec2(
            json.uvs[i],
            json.uvs[i+1],
          ))
        }
      } else {
        geometry.computeUvs()
      }
      
      if (json.colors) {
        for (let i = 0; i < json.colors.length; i += 4) {
          geometry.colors.push(new RGBAColor(
            json.colors[i],
            json.colors[i+1],
            json.colors[i+2],
            json.colors[i+3],
          ))
        }
      }

      return geometry
    })
  }
}