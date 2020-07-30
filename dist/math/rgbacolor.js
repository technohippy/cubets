export class RGBAColor {
    constructor(r, g, b, a = 1) {
        if (r <= 1 && g <= 1 && g <= 1 && a <= 1) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        else {
            console.warn("arguments must be less than or equal to 1.0.");
            this.r = r / 255;
            this.g = g / 255;
            this.b = b / 255;
            this.a = a / 255;
        }
    }
    static random() {
        return new RGBAColor(Math.random(), Math.random(), Math.random());
    }
    static fromNumber(n) {
        const r = (n & 0xff0000) >> 16;
        const g = (n & 0x00ff00) >> 8;
        const b = n & 0x0000ff;
        return new RGBAColor(r / 255, g / 255, b / 255);
    }
    toArray() {
        return [this.r, this.g, this.b, this.a];
    }
}
RGBAColor.White = new RGBAColor(1, 1, 1);
RGBAColor.Gray = new RGBAColor(0.5, 0.5, 0.5);
RGBAColor.Black = new RGBAColor(0, 0, 0);
RGBAColor.Red = new RGBAColor(1, 0, 0);
RGBAColor.Green = new RGBAColor(0, 1, 0);
RGBAColor.Blue = new RGBAColor(0, 0, 1);
