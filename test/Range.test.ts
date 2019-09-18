import * as fs from 'fs';
import Range from '../src/Range';

describe('Range', () => {
  describe('1 arg', () => {
    it('creates a new Range object', () => {
      const range = new Range(0);
      expect(range).toBeInstanceOf(Range);
    });

    it('throws an error when stop parameter is not provided', () => {
      expect(() => new Range()).toThrow('Parameter "stop" is not a number');
    });

    it('throws an error when stop parameter is not a number', () => {
      expect(() => new Range('a')).toThrow('Parameter "stop" is not a number');
    });

    it('throws an error when stop parameter is not an integer', () => {
      expect(() => new Range(1.1)).toThrow('Parameter "stop" must be an integer');
    });

    it('throws an error when stop parameter is NaN', () => {
      expect(() => new Range(NaN)).toThrow('Parameter "stop" is not a number');
    });

    it('throws an error when stop parameter is not an integer', () => {
      expect(() => new Range(1.1)).toThrow();
    });

    it('returns an empty range if 0 is passed in', () => {
      const range = new Range(0);
      expect([...range]).toEqual([]);
    });

    it('returns an empty range if a negative number is passed in', () => {
      const range = new Range(-10);
      expect([...range]).toEqual([]);
    });

    it('returns an range of 0 if 1 is passed in', () => {
      expect([...new Range(1)]).toEqual([0]);
    });

    it('returns an range of 0-9 if 10 is passed in', () => {
      expect([...new Range(10)]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('returns identical results for lazy and eager versions', () => {
      expect([...new Range(9, { lazy: true })])
        .toEqual([...new Range(9, { lazy: false })]);
    });
  });

  describe('2 args', () => {
    it('accepts a start and an stop', () => {
      expect(new Range(1, 99)).toBeInstanceOf(Range)
    });

    it('returns an range of 10-19 if 10 and 20 are passed in', () => {
      expect([...new Range(10, 20)]).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    });

    it('returns an range of 10-19 if 10 and 20 are passed in', () => {
      expect([...new Range(10, 1)]).toEqual([]);
    });

    it('handles negative starting ranges', () => {
      expect([...new Range(-10, 0)]).toEqual([-10, -9, -8, -7, -6, -5, -4, -3, -2, -1]);
    });

    it('returns identical results for lazy and eager versions', () => {
      expect([...new Range(1, 99, { lazy: true })])
        .toEqual([...new Range(1, 99, { lazy: false })]);
    });

    it('throws an error when start parameter is not a number', () => {
      expect(() => new Range('a', 1)).toThrow('Parameter "start" is not a number');
    });

    it('throws an error when start parameter is not an integer', () => {
      expect(() => new Range(1.1, 1)).toThrow('Parameter "start" must be an integer');
    });

    it('throws an error when start parameter is NaN', () => {
      expect(() => new Range(NaN, 1)).toThrow('Parameter "start" is not a number');
    });
  });

  describe('3 args', () => {
    it('accepts 3 number arguments', () => {
      expect(new Range(1, 99, 2)).toBeInstanceOf(Range)
    });

    it('throws an error if 0 is passed as step', () => {
      expect(() => new Range(1, 2, 0)).toThrow();
    })

    it('returns an range of 10-2 if 10, 1, and -1 are passed in', () => {
      expect([...new Range(10, 1, -1)]).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2]);
    });

    it('returns the correct range for 5, 25, and 3', () => {
      expect([...new Range(5, 25, 3)]).toEqual([5, 8, 11, 14, 17, 20, 23]);
    });

    it('returns the correct range for 5, 25, and 4', () => {
      expect([...new Range(5, 25, 4)]).toEqual([5, 9, 13, 17, 21]);
    });

    it('returns the correct range for 1, 99, and 14', () => {
      expect([...new Range(1, 99, 14)]).toEqual([1, 15, 29, 43, 57, 71, 85]);
    });

    it('returns identical results for lazy and eager versions', () => {
      expect([...new Range(1, 99, 14, { lazy: true })])
        .toEqual([...new Range(1, 99, 14, { lazy: false })]);
    });

    it('returns the start as the only element if the step is greater than stop - start', () => {
      expect([...new Range(0, 1, 3)]).toEqual([0]);
    });

    it('properly rounds up to ensure total capture of appropriate length', () => {
      expect([...new Range(0, 4, 3)]).toEqual([0, 3]);
    });

    it('handles steps that will never stop', () => {
      expect([...new Range(10, 1, 1)]).toEqual([]);
    });

    it('handles steps that will never stop', () => {
      expect([...new Range(1, 10, -2)]).toEqual([]);
    });

    it('throws an error when step parameter is not a number', () => {
      expect(() => new Range(1, 1, 'a')).toThrow('Parameter "step" is not a number');
    });

    it('throws an error when step parameter is not an integer', () => {
      expect(() => new Range(1, 1, 1.1)).toThrow('Parameter "step" must be an integer');
    });

    it('throws an error when step parameter is NaN', () => {
      expect(() => new Range(1, 1, NaN)).toThrow('Parameter "step" is not a number');
    });
  });

  describe('Big tests', () => {
    it('matches a lot of test cases', () => {
      let i = 0;
      const expectedValues = JSON.parse(fs.readFileSync(`${__dirname}/test1.json`, 'utf8'));
      for (const x of new Range(10)) {
        for (const y of new Range(10)) {
          for (const z of new Range(1, 10)) {
            const range = [...new Range(x, y, z)];
            try {
              expect(range).toEqual(expectedValues[`${x}${y}${z}`]);
              i += 1;
            } catch (e) {
              console.error(`${x}${y}${z}`)
              throw e;
            }
          }
        }
      }
    });

    it('matches more test cases', () => {
      let i = 0;
      const expectedValues = JSON.parse(fs.readFileSync(`${__dirname}/test2.json`, 'utf8'));
      for (const x of new Range(-10, 0)) {
        for (const y of new Range(-10, 0)) {
          for (const z of new Range(-10, -1)) {
            const range = [...new Range(z, y ,x)];
            try {
              expect(range).toEqual(expectedValues[`${x}${y}${z}`]);
              i += 1;
            } catch (e) {
              console.error(`${x}${y}${z}`)
              throw e;
            }
          }
        }
      }
    });
  });

  describe('toString', () => {
    it('returns [object Range]', () => {
      expect(Object.prototype.toString.call(new Range(0))).toEqual('[object Range]')
    });
  });
});
