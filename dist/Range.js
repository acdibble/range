"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isNumber = (obj) => typeof obj === 'number'
    && Object.prototype.toString.call(obj) === '[object Number]'
    && !Number.isNaN(obj);
class Range {
    constructor(start, end, step = 1) {
        let validStart;
        let validEnd;
        if (end == null) {
            validStart = 0;
            validEnd = start;
        }
        else {
            validStart = start;
            validEnd = end;
        }
        if (validStart == null || !isNumber(validStart)) {
            throw new TypeError('Parameter "start" is not a number');
        }
        else if (!Number.isInteger(validStart)) {
            throw new TypeError('Parameter "start" must be an integer');
        }
        if (validEnd == null || !isNumber(validEnd)) {
            throw new TypeError('Parameter "end" is not a number');
        }
        else if (!Number.isInteger(validEnd)) {
            throw new TypeError('Parameter "end" must be an integer');
        }
        if (step == null || !isNumber(step)) {
            throw new TypeError('Parameter "step" is not a number');
        }
        else if (!Number.isInteger(step)) {
            throw new TypeError('Parameter "step" must be an integer');
        }
        else if (step === 0) {
            throw new RangeError('Parameter "step" must not be 0');
        }
        const length = Math.ceil((validEnd - validStart) / step)
            || +(validStart < validEnd && step > 0)
            || +(validEnd < validStart && step < 0);
        this.range = Array.from({ length });
        for (let i = 0; i < length; i++) {
            this.range[i] = (i * step) + validStart;
        }
    }
    *[Symbol.iterator]() {
        const length = this.range.length;
        for (let i = 0; i < length; i++) {
            yield this.range[i];
        }
    }
    get [Symbol.toStringTag]() {
        return 'Range';
    }
}
exports.default = Range;
