import { Renderer } from "./renderer.js"
import { Scene } from "./scene.js"
import { FilteredCamera } from "./camera.js";
import { RenderTarget } from "./rendertarget.js";
import { FilterScene } from "./filter/filterscene.js";
import { FilterMaterial } from "./filter/filtermaterial.js";

export abstract class Filter {
  scene: FilterScene
  
  renderer?: Renderer

  inputRenderTarget?: RenderTarget
  outputRenderTarget?: RenderTarget

  constructor(scene:FilterScene | string, material:FilterMaterial | ((gl:WebGL2RenderingContext, renderer:Renderer)=>void) = new FilterMaterial()) {
    let mat:FilterMaterial
    if (material instanceof FilterMaterial) {
      mat = material
    } else {
      mat = new FilterMaterial(material)
    }
    mat.filter = this

    if (typeof scene === "string") {
      const body = scene as string
      scene = new FilterScene((frag:string, frame:string)=>body)
    }
    this.scene = scene
    this.scene.setup(mat)
  }

  setupRenderTarget(parentRenderer:Renderer) {
    this.renderer = parentRenderer.renew()
    this.renderer.prepareRender(this.scene)

    const { width, height } = this.renderer.container!

    this.inputRenderTarget = new RenderTarget(width, height)
    this.inputRenderTarget.setup(this.renderer.gl)

    this.outputRenderTarget = new RenderTarget(width, height) // default output (to screen)

    parentRenderer.use()
  }

  resetFrameBuffer() {
    if (!this.renderer) return
    this.inputRenderTarget?.reset(this.renderer.gl)
  }

  draw() {
    this.renderer!.render(this.scene, new FilterCamera())
  }
}

// do almost nothing
class FilterCamera implements FilteredCamera {
  resetFilters() {
    // do nothing
  }

  applyFilters(renderer:Renderer, fn:()=>void) {
    fn()
  }
  
  setupGLMatrixes(renderer:Renderer, scene:Scene) {
    // do nothing
  }
}

export class FilterChain {
  filters: Filter[] = []

  push(filter:Filter) {
    if (0 < this.filters.length) {
      const lastFilter = this.filters[this.filters.length-1]
      lastFilter.outputRenderTarget = filter.inputRenderTarget
    }
    this.filters.push(filter)
  }

  forEach(fn:(filter:Filter) => void) {
    this.filters.forEach(fn)
  }

  apply(parentRenderer: Renderer, fn:() => void) {
    const gl = parentRenderer.gl

    if (0 < this.filters.length) {
      this.filters[0].inputRenderTarget?.apply(gl)
    }

    fn()
    
    this.filters.forEach(filter => {
      filter.renderer!.use()
      filter.outputRenderTarget!.apply(gl)
      filter.draw()
    })

    parentRenderer.use()
  }
}

