const isNumber = (obj: any): boolean => typeof obj === 'number'
  && Object.prototype.toString.call(obj) === '[object Number]'
  && !Number.isNaN(obj);

export default class Range {
  private start: number;
  private length: number;
  private step: number;

  constructor(start: number, end?: number, step: number = 1) {
    let validStart;
    let validEnd;
    if (end == null) {
      validStart = 0;
      validEnd = start;
    } else {
      validStart = start;
      validEnd = end;
    }

    if (validStart == null || !isNumber(validStart)) {
      throw new TypeError('Parameter "start" is not a number');
    } else if (!Number.isInteger(validStart)) {
      throw new TypeError('Parameter "start" must be an integer');
    }

    if (validEnd == null || !isNumber(validEnd)) {
      throw new TypeError('Parameter "end" is not a number');
    } else if (!Number.isInteger(validEnd)) {
      throw new TypeError('Parameter "end" must be an integer');
    }

    if (step == null || !isNumber(step)) {
      throw new TypeError('Parameter "step" is not a number');
    } else if (!Number.isInteger(step)) {
      throw new TypeError('Parameter "step" must be an integer');
    } else if (step === 0) {
      throw new RangeError('Parameter "step" must not be 0');
    }

    this.start = validStart;
    this.step = step;
    this.length = Math.ceil((validEnd - validStart) / step)
      || +(validStart < validEnd && step > 0)
      || +(validEnd < validStart && step < 0);
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.length; i++) {
      yield (i * this.step) + this.start;
    }
  }

  get [Symbol.toStringTag]() {
    return 'Range';
  }
}
