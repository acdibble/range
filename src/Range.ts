const isNumber = (obj: any): obj is number => typeof obj === 'number'
  && Object.prototype.toString.call(obj) === '[object Number]'
  && !Number.isNaN(obj);

type NumberOrNullish = number | undefined | null;

export default class Range {
  readonly step: number;

  readonly start: number;

  readonly stop: number;

  readonly length: number;

  static isRange(obj: unknown): obj is Range {
    return Object.prototype.toString.call(obj) === '[object Range]';
  }

  constructor(start: number, stop?: number, step: number = 1) {
    let rangeStart = start;
    let rangeStop = stop;

    if (stop == null) {
      rangeStart = 0;
      rangeStop = start;
    }

    if (rangeStart == null || !isNumber(rangeStart)) {
      throw new TypeError('Parameter "start" is not a number');
    } else if (!Number.isInteger(rangeStart)) {
      throw new TypeError('Parameter "start" must be an integer');
    }

    if (rangeStop == null || !isNumber(rangeStop)) {
      throw new TypeError('Parameter "stop" is not a number');
    } else if (!Number.isInteger(rangeStop)) {
      throw new TypeError('Parameter "stop" must be an integer');
    }

    if (step == null || !isNumber(step)) {
      throw new TypeError('Parameter "step" is not a number');
    } else if (!Number.isInteger(step)) {
      throw new TypeError('Parameter "step" must be an integer');
    } else if (step === 0) {
      throw new RangeError('Parameter "step" must not be 0');
    }

    this.start = rangeStart;
    this.step = step;
    this.stop = rangeStop;
    this.length = Math.ceil((rangeStop - rangeStart) / step)
      || +(rangeStart < rangeStop && step > 0)
      || +(rangeStop < rangeStart && step < 0);

    Object.freeze(this);
  }

  * [Symbol.iterator](): IterableIterator<number> {
    const { start, length, step } = this;

    for (let i = 0; i < length; i += 1) {
      yield start + (i * step);
    }
  }

  equals(range: unknown): boolean {
    if (!Range.isRange(range)) {
      return false;
    }

    const thisGen = this[Symbol.iterator]();
    const otherGen = range[Symbol.iterator]();

    let thisVal = thisGen.next();
    let otherVal = otherGen.next();

    while (!thisVal.done && !otherVal.done) {
      if (thisVal.value !== otherVal.value) {
        return false;
      }
      thisVal = thisGen.next();
      otherVal = otherGen.next();
    }

    return Boolean(thisVal.done && otherVal.done);
  }

  has(number: number): boolean {
    const gen = this[Symbol.iterator]();

    for (let it = gen.next(); !it.done; it = gen.next()) {
      if (it.value === number) {
        return true;
      }
    }

    return false;
  }

  indexOf(number: number): number {
    const gen = this[Symbol.iterator]();

    for (let it = gen.next(), i = 0; !it.done; it = gen.next(), i += 1) {
      if (it.value === number) {
        return i;
      }
    }

    return -1;
  }

  slice(start: NumberOrNullish, end?: NumberOrNullish, step: NumberOrNullish = 1): Range {
    const stepMult = isNumber(step) && Number.isInteger(step)
      ? step
      : 1;

    const gen = this[Symbol.iterator]();

    let startIndex = start;
    if (start == null || !isNumber(start)) {
      startIndex = 0;
    } else if (start < 0 && Math.abs(start) > this.length) {
      startIndex = 0;
    } else if (start < 0) {
      startIndex = this.length + start;
    }

    let endIndex = end;
    if (end == null || !isNumber(end)) {
      endIndex = this.length;
    } else if (end < 0 && Math.abs(end) > this.length) {
      endIndex = 0;
    } else if (end < 0) {
      endIndex = this.length + end;
    }

    let startVal: number = this.start;
    let endVal: number = this.stop;
    for (let it = gen.next(), i = 0; !it.done; it = gen.next(), i += 1) {
      if (i === startIndex) {
        startVal = it.value;
      }

      if (i === endIndex) {
        endVal = it.value;
      }
    }

    return new Range(startVal, endVal, this.step * stepMult);
  }

  at(index: number): number | void {
    const gen = this[Symbol.iterator]();

    for (let it = gen.next(), i = 0; !it.done; it = gen.next(), i += 1) {
      if (i === index) {
        return it.value;
      }
    }

    return undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag](): string {
    return 'Range';
  }
}
