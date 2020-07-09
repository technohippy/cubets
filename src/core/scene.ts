import { Mesh } from './mesh.js'
import { Light } from './light.js'

export class Scene {
  meshes: Mesh[] = []
  lights: Light[] = []

  add(obj: Mesh | Light) {
    if (obj instanceof Mesh) {
      this.addMesh(obj)
    } else if (obj instanceof Light) {
      this.addLight(obj)
    }
  }

  addMesh(mesh: Mesh) {
    this.meshes.push(mesh)
  }

  addLight(light: Light) {
    this.lights.push(light)
  }

  each(fn: (obj: Mesh | Light) => void) {
    this.eachMesh(fn)
    this.eachLight(fn)
  }

  eachMesh(fn: (obj: Mesh) => void) {
    this.meshes.forEach(fn)
  }

  eachLight(fn: (obj: Light) => void) {
    this.lights.forEach(fn)
  }
}