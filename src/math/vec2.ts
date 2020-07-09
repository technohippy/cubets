//@ts-ignore
import { glMatrix, vec3 } from "../../node_modules/gl-matrix/esm/index.js"
glMatrix.setMatrixArrayType(Array)

export class Vec2 {
  x:number
  y:number

  constructor(x:number=0, y:number=0) {
    this.x = x
    this.y = y
  }
 
  translate(amount:Vec2) {
    this.asArray((vals:number[]):number[] => {
      return vec3.add(vals, vals, amount)
    })
  }

  toArray(): number[] {
    return [this.x, this.y]
  }

  fromArray(values:number[]) {
    [this.x, this.y] = values
  }

  asArray(fn:(vals:number[]) => number[]) {
    this.fromArray(fn(this.toArray()))
  }
}