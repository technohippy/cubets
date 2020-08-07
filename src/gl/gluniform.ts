export class GLUniform {
  name:string
  location?:WebGLUniformLocation | null
  type:string
  values:number[]
  constructor(name:string, type:string, ...values:number[]) {
    this.name = name
    this.type = type
    this.values = [...values]
  }
}