interface IOptions {
  lazy: boolean;
}

const isNumber = (obj: any): obj is number => typeof obj === 'number'
  && Object.prototype.toString.call(obj) === '[object Number]'
  && !Number.isNaN(obj);

const isObject = (obj: any): obj is object => typeof obj === 'object'
  && Object.prototype.toString.call(obj) === '[object Object]';

export default class Range {
  private step: number;

  private opts: IOptions;

  private start: number;

  private range: number[];

  private length: number;

  static defaultOpts = { lazy: false };

  constructor(
    start: number,
    stop?: number | IOptions,
    step: number | IOptions = 1,
    opts = Range.defaultOpts,
  ) {
    this.range = [];
    this.length = 0;

    let rangeStart = start;
    let rangeStep = step;
    let rangeStop = stop;
    let rangeOpts = opts;

    if (isObject(stop)) {
      rangeOpts = stop;
      rangeStart = 0;
      rangeStop = start;
    }

    if (isObject(step)) {
      rangeOpts = step;
      rangeStep = 1;
    }

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

    if (rangeStep == null || !isNumber(rangeStep)) {
      throw new TypeError('Parameter "step" is not a number');
    } else if (!Number.isInteger(rangeStep)) {
      throw new TypeError('Parameter "step" must be an integer');
    } else if (rangeStep === 0) {
      throw new RangeError('Parameter "step" must not be 0');
    }

    this.start = rangeStart;
    this.step = rangeStep;
    this.opts = rangeOpts;

    const length = Math.ceil((rangeStop - rangeStart) / rangeStep)
      || +(rangeStart < rangeStop && step > 0)
      || +(rangeStop < rangeStart && step < 0);

    if (!rangeOpts.lazy) {
      this.range = Array.from({ length });
      for (let i = 0; i < length; i++) {
        this.range[i] = rangeStart + (i * rangeStep);
      }
    } else {
      this.length = length;
    }
  }

  [Symbol.iterator]() {
    if (!this.opts.lazy) {
      return this.range[Symbol.iterator]();
    }

    const { length, step, start } = this;
    return (function* range() {
      for (let i = 0; i < length; i++) {
        yield start + (i * step);
      }
    }());
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'Range';
  }
}
