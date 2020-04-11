import tap from 'tap';
import LazyRange from '../../src/LazyRange';

tap.test('LazyRange#skip', async (suite) => {
  const range = new LazyRange(0, 100, 2);

  suite.test('skips the first number of elements', async (t) => {
    t.deepEqual([...range.skip(40)], [80, 82, 84, 86, 88, 90, 92, 94, 96, 98]);
  });

  suite.test('handles a number larger than the length of the range', async (t) => {
    t.deepEqual([...range.skip(1000)], []);
  });

  suite.test('errors if amount is not a number', async (t) => {
    t.throws(() => range.skip(NaN), new TypeError('Parameter "amount" is not a number'));
  });

  suite.test('errors if amount is not an integer', async (t) => {
    t.throws(() => range.skip(1.1), new TypeError('Parameter "amount" must be an integer'));
  });

  suite.test('errors if amount is less than 0', async (t) => {
    t.throws(() => range.skip(-1), new RangeError('Parameter "amount" must not be negative'));
  });
});
