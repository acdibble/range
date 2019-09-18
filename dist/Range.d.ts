export default class Range {
    private range;
    constructor(start: number, end?: number, step?: number);
    [Symbol.iterator](): Generator<number, void, unknown>;
    readonly [Symbol.toStringTag]: string;
}
