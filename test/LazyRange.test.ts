import tap from 'tap';
import * as fs from 'fs';
import LazyRange from '../src/LazyRange';

tap.test('LazyRange', async (suite) => {
  suite.test('constructor', async (subSuite) => {
    subSuite.test('creates a new LazyRange object', async (t) => {
      const range = new LazyRange(0);
      t.type(range, LazyRange);
    });

    subSuite.test('throws an error when stop parameter is not a number', async (t) => {
      // @ts-expect-error
      t.throws(() => new LazyRange(), 'Parameter "stop" is not a number');
    });

    subSuite.test('throws an error when stop parameter is not a number', async (t) => {
      // @ts-expect-error
      t.throws(() => new LazyRange('a'), 'Parameter "stop" is not a number');
    });

    subSuite.test('throws an error when stop parameter is not an integer', async (t) => {
      t.throws(() => new LazyRange(1.1), 'Parameter "stop" must be an integer');
    });

    subSuite.test('throws an error when stop parameter is NaN', async (t) => {
      t.throws(() => new LazyRange(NaN), 'Parameter "stop" is not a number');
    });

    subSuite.test('throws an error when stop parameter is not an integer', async (t) => {
      t.throws(() => new LazyRange(1.1));
    });

    subSuite.test('returns an empty range if 0 is passed in', async (t) => {
      t.deepEqual([...new LazyRange(0)], []);
    });

    subSuite.test('returns an empty range if a negative number is passed in', async (t) => {
      t.deepEqual([...new LazyRange(-10)], []);
    });

    subSuite.test('returns an range of 0 if 1 is passed in', async (t) => {
      t.deepEqual([...new LazyRange(1)], [0]);
    });

    subSuite.test('returns an range of 0-9 if 10 is passed in', async (t) => {
      t.deepEqual([...new LazyRange(10)], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  suite.test('2 args constructor', async (subSuite) => {
    subSuite.test('accepts a start and an stop', async (t) => {
      t.type(new LazyRange(1, 99), LazyRange);
    });

    subSuite.test('returns an range of 10-19 if 10 and 20 are passed in', async (t) => {
      t.deepEqual([...new LazyRange(10, 20)], [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    });

    subSuite.test('returns an empty range if the step is positive and stop is less than start', async (t) => {
      t.deepEqual([...new LazyRange(10, 1)], []);
    });

    subSuite.test('handles negative starting ranges', async (t) => {
      t.deepEqual([...new LazyRange(-10, 0)], [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1]);
    });

    subSuite.test('throws an error when start parameter is not a number', async (t) => {
      // @ts-expect-error
      t.throws(() => new LazyRange('a', 1), 'Parameter "start" is not a number');
    });

    subSuite.test('throws an error when start parameter is not an integer', async (t) => {
      t.throws(() => new LazyRange(1.1, 1), 'Parameter "start" must be an integer');
    });

    subSuite.test('throws an error when start parameter is NaN', async (t) => {
      t.throws(() => new LazyRange(NaN, 1), 'Parameter "start" is not a number');
    });
  });

  suite.test('3 args constructor', async (subSuite) => {
    subSuite.test('accepts 3 number arguments', async (t) => {
      t.type(new LazyRange(1, 99, 2), LazyRange);
    });

    subSuite.test('throws an error if 0 is passed as step', async (t) => {
      t.throws(() => new LazyRange(1, 2, 0));
    });

    subSuite.test('returns an range of 10-2 if 10, 1, and -1 are passed in', async (t) => {
      t.deepEqual([...new LazyRange(10, 1, -1)], [10, 9, 8, 7, 6, 5, 4, 3, 2]);
    });

    subSuite.test('returns the correct range for 5, 25, and 3', async (t) => {
      t.deepEqual([...new LazyRange(5, 25, 3)], [5, 8, 11, 14, 17, 20, 23]);
    });

    subSuite.test('returns the correct range for 5, 25, and 4', async (t) => {
      t.deepEqual([...new LazyRange(5, 25, 4)], [5, 9, 13, 17, 21]);
    });

    subSuite.test('returns the correct range for 1, 99, and 14', async (t) => {
      t.deepEqual([...new LazyRange(1, 99, 14)], [1, 15, 29, 43, 57, 71, 85]);
    });

    subSuite.test('returns the start as the only element if the step is greater than stop - start', async (t) => {
      t.deepEqual([...new LazyRange(0, 1, 3)], [0]);
    });

    subSuite.test('properly rounds up to ensure total capture of appropriate length', async (t) => {
      t.deepEqual([...new LazyRange(0, 4, 3)], [0, 3]);
    });

    subSuite.test('handles steps that will never stop', async (t) => {
      t.deepEqual([...new LazyRange(10, 1, 1)], []);
    });

    subSuite.test('handles steps that will never stop', async (t) => {
      t.deepEqual([...new LazyRange(1, 10, -2)], []);
    });

    subSuite.test('throws an error when step parameter is not a number', async (t) => {
      // @ts-expect-error
      t.throws(() => new LazyRange(1, 1, 'a'), 'Parameter "step" is not a number');
    });

    subSuite.test('throws an error when step parameter is not an integer', async (t) => {
      t.throws(() => new LazyRange(1, 1, 1.1), 'Parameter "step" must be an integer');
    });

    subSuite.test('throws an error when step parameter is NaN', async (t) => {
      t.throws(() => new LazyRange(1, 1, NaN), 'Parameter "step" is not a number');
    });
  });

  suite.test('Big tests', async (subSuite) => {
    subSuite.test('matches a lot of test cases', async (t) => {
      const expectedValues = JSON.parse(fs.readFileSync(`${__dirname}/test1.json`, 'utf8'));
      for (const x of new LazyRange(10)) {
        for (const y of new LazyRange(10)) {
          for (const z of new LazyRange(1, 10)) {
            const range = [...new LazyRange(x, y, z)];
            try {
              t.deepEqual(range, expectedValues[`${x}${y}${z}`]);
            } catch (e) {
              console.error(`${x}${y}${z}`);
              throw e;
            }
          }
        }
      }
    });

    subSuite.test('matches more test cases', async (t) => {
      const expectedValues = JSON.parse(fs.readFileSync(`${__dirname}/test2.json`, 'utf8'));
      for (const x of new LazyRange(-10, 0)) {
        for (const y of new LazyRange(-10, 0)) {
          for (const z of new LazyRange(-10, -1)) {
            const range = [...new LazyRange(z, y, x)];
            try {
              t.deepEqual(range, expectedValues[`${x}${y}${z}`]);
            } catch (e) {
              console.error(`${x}${y}${z}`);
              throw e;
            }
          }
        }
      }
    });
  });

  suite.test('LazyRange#toString', async (subSuite) => {
    subSuite.test('returns [object LazyRange]', async (t) => {
      t.equal(Object.prototype.toString.call(new LazyRange(0)), '[object LazyRange]');
    });

    subSuite.test('returns [object LazyRange]', async (t) => {
      t.equal(new LazyRange(0).toString(), '[object LazyRange]');
    });
  });

  suite.test('LazyRange#equals', async (subSuite) => {
    subSuite.test('finds ranges equivalent', async (t) => {
      t.true(new LazyRange(0).equals(new LazyRange(2, 1, 3)));
      t.true(new LazyRange(0, 3, 2).equals(new LazyRange(0, 4, 2)));
      t.true(new LazyRange(10).equals(new LazyRange(0, 10, 1)));
      t.true(new LazyRange(0, 20, -2).equals(new LazyRange(0, 0)));
    });

    subSuite.test('finds ranges nonequivalent (length difference)', async (t) => {
      t.false(new LazyRange(10).equals(new LazyRange(9)));
    });

    subSuite.test('finds ranges nonequivalent (different values)', async (t) => {
      t.false(new LazyRange(-9, 2, 1).equals(new LazyRange(11)));
    });

    subSuite.test('returns false for non-range objects', async (t) => {
      t.false(new LazyRange(10).equals(1));
    });
  });

  suite.test('frozen', async (subSuite) => {
    subSuite.test('creates frozen instances', async (t) => {
      t.true(Object.isFrozen(new LazyRange(10)));
    });
  });

  suite.test('LazyRange#has', async (subSuite) => {
    const range = new LazyRange(0, 20, 2);
    const numbers = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];

    await Promise.all(numbers.map((number) => (
      subSuite.test('returns true if an element is found', async (t) => (
        t.true(range.has(number))
      ))
    )));

    await Promise.all([-1, 1, 11].map((number) => (
      subSuite.test('returns false if an element is not found', async (t) => (
        t.false(range.has(number))
      ))
    )));

    subSuite.test('returns false if an element is not found', async (t) => {
      t.false(new LazyRange(0, 20, -2).has(10));
    });

    subSuite.test('returns false if an element is not found', async (t) => {
      t.false(new LazyRange(0, 20, -2).has(0));
      t.false(new LazyRange(0).has(0));
    });
  });

  suite.test('LazyRange#indexOf', async (subSuite) => {
    const range = new LazyRange(0, 20, 2);
    const numbers = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];

    numbers.forEach((num, index) => {
      subSuite.test('returns the index of an element if found', async (t) => (
        t.equal(range.indexOf(num), index)
      ));
    });

    [-1, 1, 20].forEach((number) => {
      subSuite.test('returns -1 if no element is found', async (t) => (
        t.equal(range.indexOf(number), -1)
      ));
    });

    subSuite.test('returns -1 if no element is found', async (t) => {
      t.equal(new LazyRange(0, 1, -1).indexOf(1), -1);
    });
  });

  suite.test('LazyRange#slice', async (subSuite) => {
    const range = new LazyRange(0, 20, 2);

    subSuite.test('grabs all the elements after a start index', async (t) => {
      t.true(range.slice(5).equals(new LazyRange(10, 20, 2)));
    });

    subSuite.test('supports a negative start number', async (t) => {
      t.true(range.slice(-2).equals(new LazyRange(16, 20, 2)));
    });

    subSuite.test('supports a very negative start number', async (t) => {
      t.true(range.slice(-1112).equals(range));
    });

    subSuite.test('supports a start and an end', async (t) => {
      t.true(range.slice(1, 3).equals(new LazyRange(2, 6, 2)));
    });

    subSuite.test('behaves correctly when start > end', async (t) => {
      t.true(range.slice(4, 3).equals(new LazyRange(8, 6, 2)));
    });

    subSuite.test('behaves correctly when start = end', async (t) => {
      t.true(range.slice(4, 4).equals(new LazyRange(8, 8, 2)));
    });

    subSuite.test('behaves correctly when end < 0', async (t) => {
      t.true(range.slice(2, -3).equals(new LazyRange(4, 14, 2)));
    });

    subSuite.test('behaves correctly when end very < 0', async (t) => {
      t.true(range.slice(2, -300).equals(new LazyRange(4, 0, 2)));
    });

    subSuite.test('accepts a step multiplier', async (t) => {
      t.true(range.slice(0, -1, 3).equals(new LazyRange(0, 18, 6)));
    });

    subSuite.test('accepts a step negative multiplier', async (t) => {
      t.true(range.slice(0, -1, -3).equals(new LazyRange(0, 18, -6)));
    });

    subSuite.test('accepts null/undefined in the first position', async (t) => {
      t.true(range.slice(null, -1, 2).equals(new LazyRange(0, 18, 4)));
    });

    subSuite.test('accepts null/undefined in the second position', async (t) => {
      t.true(range.slice(0, null, 2).equals(new LazyRange(0, 18, 4)));
    });

    subSuite.test('accepts null/undefined in the third position', async (t) => {
      // @ts-expect-error
      t.true(range.slice(2, -3, null).equals(new LazyRange(4, 14, 2)));
    });
  });

  suite.test('LazyRange#at', async (subSuite) => {
    const range = new LazyRange(0, 20, 2);
    subSuite.test('gets the element at the given index', async (t) => {
      t.equal(range.at(5), 10);
    });

    subSuite.test('returns undefined when out of range', async (t) => {
      t.equal(range.at(10), undefined);
      t.equal(range.at(30), undefined);
    });

    subSuite.test('returns undefined when range length is 0', async (t) => {
      t.equal(new LazyRange(0, 20, -2).at(5), undefined);
      t.equal(new LazyRange(0).at(0), undefined);
    });

    [[], 0.5, {}, 'a'].forEach((value: any) => {
      subSuite.test('returns undefined when non-integers are passed in', async (t) => (
        t.equal(new LazyRange(10).at(value), undefined)
      ));
    });
  });

  suite.test('length', async (subSuite) => {
    ([
      [[10], 10],
      [[0, 10, -1], 0],
      [[0], 0],
    ] as [([number] | [number, number, number]), number][]).forEach(([[a, b, c], length]) => {
      subSuite.test('gets the proper length', async (t) => (
        // @ts-expect-error
        t.equal(new LazyRange(a, b, c).length, length)
      ));
    });
  });
});
