export class RGBAColor {
  r: number
  g: number
  b: number
  a: number

  static White = new RGBAColor(1, 1, 1)
  static Gray = new RGBAColor(0.5, 0.5, 0.5)
  static Black = new RGBAColor(0, 0, 0)
  static Red = new RGBAColor(1, 0, 0)
  static Green = new RGBAColor(0, 1, 0)
  static Blue = new RGBAColor(0, 0, 1)

  static random(): RGBAColor {
    return new RGBAColor(Math.random(), Math.random(), Math.random())
  }

  static fromNumber(n:number): RGBAColor {
    const r = (n & 0xff0000) >> 16
    const g = (n & 0x00ff00) >> 8 
    const b = n & 0x0000ff
    return new RGBAColor(r/255, g/255, b/255)
  }

  constructor(r:number, g:number, b:number, a:number = 1) {
    if (r <= 1 && g <= 1 && g <= 1 && a <= 1) {
      this.r = r
      this.g = g
      this.b = b
      this.a = a
    } else {
      console.warn("arguments must be less than or equal to 1.0.")
      this.r = r / 255
      this.g = g / 255
      this.b = b / 255
      this.a = a / 255
    }
  }

  toArray(): number[] {
    return [this.r, this.g, this.b, this.a]
  }
}