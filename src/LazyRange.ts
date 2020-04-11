const isNumber = (obj: unknown): obj is number => typeof obj === 'number'
  && Object.prototype.toString.call(obj) === '[object Number]'
  && !Number.isNaN(obj);

class LazyRange {
  private readonly step: number;

  private readonly start: number;

  private readonly stop: number;

  readonly length: number;

  static isRange(obj: unknown): obj is LazyRange {
    return Object.prototype.toString.call(obj) === '[object LazyRange]'
      && obj instanceof LazyRange;
  }

  constructor(stop: number);
  constructor(start: number, stop: number);
  constructor(start: number, stop: number, step: number);
  constructor(arg0: number, arg1?: number, arg2 = 1) {
    let rangeStart = arg0;
    let rangeStop = arg1;

    if (arg1 == null) {
      rangeStart = 0;
      rangeStop = arg0;
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

    if (!isNumber(arg2)) {
      throw new TypeError('Parameter "step" is not a number');
    } else if (!Number.isInteger(arg2)) {
      throw new TypeError('Parameter "step" must be an integer');
    } else if (arg2 === 0) {
      throw new RangeError('Parameter "step" must not be 0');
    }

    this.start = rangeStart;
    this.step = arg2;
    this.stop = rangeStop;
    this.length = Math.ceil((rangeStop - rangeStart) / arg2)
      || +(rangeStart < rangeStop && arg2 > 0)
      || +(rangeStop < rangeStart && arg2 < 0);

    this.length = this.length < 0 ? 0 : this.length;

    Object.freeze(this);
  }

  * [Symbol.iterator](): IterableIterator<number> {
    const { start, length, step } = this;

    for (let i = 0; i < length; i += 1) {
      yield start + (i * step);
    }
  }

  equals(range: unknown): boolean {
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

  slice(start: number): LazyRange;
  slice(start: number | null, stop: number): LazyRange;
  slice(start: number | null, stop: number | null, step: number): LazyRange;
  slice(arg0?: number | null, arg1?: number | null, arg2 = 1): LazyRange {
    const { length } = this;

    const stepMult = Number.isInteger(arg2)
      ? arg2
      : 1;

    const gen = this[Symbol.iterator]();

    let startIndex = arg0;
    if (!isNumber(arg0) || (arg0 < 0 && Math.abs(arg0) > length)) {
      startIndex = 0;
    } else if (arg0 < 0) {
      startIndex = length + arg0;
    }

    let endIndex = arg1;
    if (!isNumber(arg1)) {
      endIndex = length;
    } else if (arg1 < 0) {
      endIndex = Math.abs(arg1) > length ? 0 : length + arg1;
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
    return this.constructor.name;
  }

  take(amount: number): IterableIterator<number> {
    const { start, length, step } = this;
    let nextValue = start;
    let i = 0;

    return {
      next(): IteratorResult<number, undefined> {
        if (i < length && i < amount) {
          const result: IteratorResult<number> = { value: nextValue, done: false };
          i += 1;
          nextValue = start + (i * step);
          return result;
        }
        return { value: undefined, done: true };
      },
      [Symbol.iterator](): IterableIterator<number> {
        return this;
      },
    };
  }

  skip(amount: number): IterableIterator<number> {
    const { start, length, step } = this;

    if (!isNumber(amount)) {
      throw new TypeError('Parameter "amount" is not a number');
    } else if (!Number.isInteger(amount)) {
      throw new TypeError('Parameter "amount" must be an integer');
    } else if (amount < 0) {
      throw new RangeError('Parameter "amount" must not be negative');
    }

    let nextValue = start + (amount * step);
    let i = amount;

    return {
      next(): IteratorResult<number, undefined> {
        if (i >= length) {
          return { value: undefined, done: true };
        }

        const result: IteratorResult<number> = { value: nextValue, done: false };
        i += 1;
        nextValue = start + (i * step);
        return result;
      },
      [Symbol.iterator](): IterableIterator<number> {
        return this;
      },
    };
  }

  filter(cb: (n: number, index: number, range: LazyRange) => boolean): IterableIterator<number> {
    const { start, length, step } = this;
    const self = this;
    let nextValue: number;
    let i = -1;

    return {
      next(): IteratorResult<number, undefined> {
        if (i >= length) {
          return { value: undefined, done: true };
        }

        do {
          i += 1;
          nextValue = start + (i * step);
        } while (i < length && !cb(nextValue, i, self));

        return i < length
          ? { value: nextValue, done: false }
          : { value: undefined, done: true };
      },
      [Symbol.iterator](): IterableIterator<number> {
        return this;
      },
    };
  }
}

export = LazyRange;
