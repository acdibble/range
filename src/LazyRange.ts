const isNumber = (obj: any): obj is number => typeof obj === 'number'
  && Object.prototype.toString.call(obj) === '[object Number]'
  && !Number.isNaN(obj);

type NumberOrNullish = number | undefined | null;

class LazyRange {
  readonly step: number;

  readonly start: number;

  readonly stop: number;

  readonly length: number;

  static isRange(obj: unknown): obj is LazyRange {
    return Object.prototype.toString.call(obj) === '[object LazyRange]';
  }

  constructor(start: number, stop?: number, step: number = 1) {
    let rangeStart = start;
    let rangeStop = stop;

    if (stop == null) {
      rangeStart = 0;
      rangeStop = start;
    }

    if (!isNumber(rangeStart)) {
      throw new TypeError('Parameter "start" is not a number');
    } else if (!Number.isInteger(rangeStart)) {
      throw new TypeError('Parameter "start" must be an integer');
    }

    if (!isNumber(rangeStop)) {
      throw new TypeError('Parameter "stop" is not a number');
    } else if (!Number.isInteger(rangeStop)) {
      throw new TypeError('Parameter "stop" must be an integer');
    }

    if (!isNumber(step)) {
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
    if (!LazyRange.isRange(range)) {
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
    const { start, step, length } = this;
    const index = (length * step + start) / number;
    return Number.isInteger(index) && number >= 0;
  }

  indexOf(number: number): number {
    const { start, step } = this;

    if (!this.has(number)) return -1;

    return (number - start) / step;
  }

  slice(start: NumberOrNullish, end?: NumberOrNullish, step: NumberOrNullish = 1): LazyRange {
    const { length } = this;

    const stepMult = isNumber(step) && Number.isInteger(step)
      ? step
      : 1;

    const gen = this[Symbol.iterator]();

    let startIndex = start;
    if (!isNumber(start) || (start < 0 && Math.abs(start) > length)) {
      startIndex = 0;
    } else if (start < 0) {
      startIndex = length + start;
    }

    let endIndex = end;
    if (!isNumber(end)) {
      endIndex = length;
    } else if (end < 0) {
      endIndex = Math.abs(end) > length ? 0 : length + end;
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

    return new LazyRange(startVal, endVal, this.step * stepMult);
  }

  at(index: number): number | void {
    const { step, start, stop } = this;
    const value = step * index + start;

    return value >= stop ? undefined : value;
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag](): string {
    return 'LazyRange';
  }
}

export = LazyRange;
