import * as fs from 'fs';
import tap from 'tap';
import LazyRange from '../../src/LazyRange';

tap.test('LazyRange', async (suite) => {
  suite.test('constructor', async (subSuite) => {
    subSuite.test('creates a new LazyRange object', async (t) => {
      const range = new LazyRange(0);
      t.type(range, LazyRange);
    });

    subSuite.test('throws an error when stop parameter is not a number', async (t) => {
      // @ts-ignore
      t.throws(() => new LazyRange(), 'Parameter "stop" is not a number');
    });

    subSuite.test('throws an error when stop parameter is not a number', async (t) => {
      // @ts-ignore
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
      // @ts-ignore
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
      // @ts-ignore
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

  suite.test('frozen', async (subSuite) => {
    subSuite.test('creates frozen instances', async (t) => {
      t.true(Object.isFrozen(new LazyRange(10)));
    });
  });
});
