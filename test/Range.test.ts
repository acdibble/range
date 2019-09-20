import * as fs from 'fs';
import Range from '../src/Range';

describe('Range', () => {
  describe('1 arg constructor', () => {
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
  });

  describe('2 args constructor', () => {
    it('accepts a start and an stop', () => {
      expect(new Range(1, 99)).toBeInstanceOf(Range);
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

  describe('3 args constructor', () => {
    it('accepts 3 number arguments', () => {
      expect(new Range(1, 99, 2)).toBeInstanceOf(Range);
    });

    it('throws an error if 0 is passed as step', () => {
      expect(() => new Range(1, 2, 0)).toThrow();
    });

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

  /* eslint-disable no-restricted-syntax */
  describe('Big tests', () => {
    it('matches a lot of test cases', () => {
      const expectedValues = JSON.parse(fs.readFileSync(`${__dirname}/test1.json`, 'utf8'));
      for (const x of new Range(10)) {
        for (const y of new Range(10)) {
          for (const z of new Range(1, 10)) {
            const range = [...new Range(x, y, z)];
            try {
              expect(range).toEqual(expectedValues[`${x}${y}${z}`]);
            } catch (e) {
              console.error(`${x}${y}${z}`);
              throw e;
            }
          }
        }
      }
    });

    it('matches more test cases', () => {
      const expectedValues = JSON.parse(fs.readFileSync(`${__dirname}/test2.json`, 'utf8'));
      for (const x of new Range(-10, 0)) {
        for (const y of new Range(-10, 0)) {
          for (const z of new Range(-10, -1)) {
            const range = [...new Range(z, y, x)];
            try {
              expect(range).toEqual(expectedValues[`${x}${y}${z}`]);
            } catch (e) {
              console.error(`${x}${y}${z}`);
              throw e;
            }
          }
        }
      }
    });
  });
  /* eslint-enable no-restricted-syntax */

  describe('toString', () => {
    it('returns [object Range]', () => {
      expect(Object.prototype.toString.call(new Range(0))).toEqual('[object Range]');
    });
  });

  describe('Range#equals', () => {
    it('finds ranges equivalent', () => {
      expect(new Range(0).equals(new Range(2, 1, 3))).toBe(true);
      expect(new Range(0, 3, 2).equals(new Range(0, 4, 2))).toBe(true);
      expect(new Range(10).equals(new Range(0, 10, 1))).toBe(true);
    });

    it('finds ranges unequivalent (length difference)', () => {
      expect(new Range(10).equals(new Range(9))).toBe(false);
    });

    it('finds ranges unequivalent (different values)', () => {
      expect(new Range(-9, 2, 1).equals(new Range(11))).toBe(false);
    });

    it('returns false for non-range objects', () => {
      expect(new Range(10).equals(1)).toBe(false);
    });
  });

  describe('frozen', () => {
    it('creates frozen instances', () => {
      expect(Object.isFrozen(new Range(10))).toBe(true);
    });
  });

  describe('Range#has', () => {
    const range = new Range(0, 20, 2);
    it('returns true if an element is found', () => {
      expect(range.has(10)).toBe(true);
    });

    it('returns false if an element is not found', () => {
      expect(range.has(11)).toBe(false);
    });
  });

  describe('Range#indexOf', () => {
    const range = new Range(0, 20, 2);
    it('returns the index of an element if found', () => {
      expect(range.indexOf(10)).toEqual(5);
    });

    it('returns -1 if no element is found', () => {
      expect(range.indexOf(11)).toEqual(-1);
    });
  });

  describe('Range#slice', () => {
    const range = new Range(0, 20, 2);

    it('grabs all the elements after a start index', () => {
      expect(range.slice(5).equals(new Range(10, 20, 2))).toEqual(true);
    });

    it('supports a negative start number', () => {
      expect(range.slice(-2).equals(new Range(16, 20, 2))).toEqual(true);
    });

    it('supports a very negative start number', () => {
      expect(range.slice(-1112).equals(range)).toEqual(true);
    });

    it('supports a start and an end', () => {
      expect(range.slice(1, 3).equals(new Range(2, 6, 2))).toEqual(true);
    });

    it('behaves correctly when start > end', () => {
      expect(range.slice(4, 3).equals(new Range(8, 6, 2))).toEqual(true);
    });

    it('behaves correctly when start = end', () => {
      expect(range.slice(4, 4).equals(new Range(8, 8, 2))).toEqual(true);
    });

    it('behaves correctly when end < 0', () => {
      expect(range.slice(2, -3).equals(new Range(4, 14, 2))).toEqual(true);
    });

    it('behaves correctly when end very < 0', () => {
      expect(range.slice(2, -300).equals(new Range(4, 0, 2))).toEqual(true);
    });

    it('accepts a step multiplier', () => {
      expect(range.slice(0, -1, 3).equals(new Range(0, 18, 6))).toEqual(true);
    });

    it('accepts a step negative multiplier', () => {
      expect(range.slice(0, -1, -3).equals(new Range(0, 18, -6))).toEqual(true);
    });

    it('accepts null/undefined in the first position', () => {
      expect(range.slice(null, -1, 2).equals(new Range(0, 18, 4))).toEqual(true);
    });

    it('accepts null/undefined in the second position', () => {
      expect(range.slice(0, null, 2).equals(new Range(0, 18, 4))).toEqual(true);
    });

    it('accepts null/undefined in the third position', () => {
      expect(range.slice(0, -1, null).equals(new Range(0, 18, 2))).toEqual(true);
    });

    it('accepts null/undefined in all positions', () => {
      expect(range.slice(null, null, null).equals(new Range(0, 20, 2))).toEqual(true);
    });
  });

  describe('Range#at', () => {
    const range = new Range(0, 20, 2);
    it('gets the element at the given index', () => {
      expect(range.at(5)).toEqual([...range][5]);
    });

    it('returns undefined when out of range', () => {
      expect(range.at(30)).toEqual([...range][30]);
    });
  });
});
