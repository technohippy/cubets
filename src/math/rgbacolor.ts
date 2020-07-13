export class RGBAColor {
  r: number
  g: number
  b: number
  a: number

  static White = new RGBAColor(1, 1, 1)
  static Black = new RGBAColor(0, 0, 0)
  static Red = new RGBAColor(1, 0, 0)
  static Green = new RGBAColor(0, 1, 0)
  static Blue = new RGBAColor(0, 0, 1)

  static random(): RGBAColor {
    return new RGBAColor(Math.random(), Math.random(), Math.random())
  }

  constructor(r:number, g:number, b:number, a:number = 1) {
    this.r = r <= 1 ? r : r / 255
    this.g = g <= 1 ? g : g / 255
    this.b = b <= 1 ? b : b / 255
    this.a = a <= 1 ? a : a / 255
  }

  toArray(): number[] {
    return [this.r, this.g, this.b, this.a]
  }
}