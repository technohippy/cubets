export declare class RGBAColor {
    r: number;
    g: number;
    b: number;
    a: number;
    static White: RGBAColor;
    static Gray: RGBAColor;
    static Black: RGBAColor;
    static Red: RGBAColor;
    static Green: RGBAColor;
    static Blue: RGBAColor;
    static random(): RGBAColor;
    static fromNumber(n: number): RGBAColor;
    constructor(r: number, g: number, b: number, a?: number);
    toArray(): number[];
}
//# sourceMappingURL=rgbacolor.d.ts.map