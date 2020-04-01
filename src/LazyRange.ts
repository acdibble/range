const isNumber = (obj: any): obj is number => typeof obj === 'number'
  && Object.prototype.toString.call(obj) === '[object Number]'
  && !Number.isNaN(obj);

type NumberOrNullish = number | undefined | null;

class LazyRange {
  readonly step: number;

  readonly start: number;

  readonly stop: number;

  readonly length: number;

  static isRange(obj: any): obj is LazyRange {
    return Object.prototype.toString.call(obj) === '[object LazyRange]'
      && obj instanceof LazyRange;
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

    this.length = this.length < 0 ? 0 : this.length;

    Object.freeze(this);
  }

  * [Symbol.iterator](): IterableIterator<number> {
    const { start, length, step } = this;

    for (let i = 0; i < length; i += 1) {
      yield start + (i * step);
    }
  }

  equals(range: any): boolean {
    if (!LazyRange.isRange(range)) return false;

    if (this.length !== range.length) return false;

    if (this.length === 0) return true;

    return (this.step + this.start) === (range.step + range.start);
  }

  has(number: number): boolean {
    if (this.length === 0) return false;

    const { start, step, length } = this;

    const index = (number - start) / step;

    return Number.isInteger(index) && index >= 0 && index < length;
  }

  indexOf(number: number): number {
    if (this.length === 0) return -1;

    const { start, step, length } = this;

    const index = (number - start) / step;

    return Number.isInteger(index) && index >= 0 && index < length
      ? index
      : -1;
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
    const { length } = this;
    if (index < 0 || index >= length || length === 0 || !Number.isInteger(index)) {
      return undefined;
    }

    const { step, start } = this;

    const value = index * step + start;

    return value;
  }

  get [Symbol.toStringTag](): string {
    return 'LazyRange';
  }
}

export = LazyRange;
