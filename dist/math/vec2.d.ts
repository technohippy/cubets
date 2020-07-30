export declare class Vec2 {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    length(): number;
    distance(v: Vec2): number;
    translate(amount: Vec2): void;
    toArray(): number[];
    fromArray(values: number[]): void;
    asArray(fn: (vals: number[]) => number[]): void;
}
//# sourceMappingURL=vec2.d.ts.map