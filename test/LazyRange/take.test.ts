import tap from 'tap';
import LazyRange from '../../src/LazyRange';

tap.test('LazyRange#take', async (suite) => {
  const range = new LazyRange(0, 100, 2);

  suite.test('returns the requested amount of values', async (t) => {
    t.deepEqual([...range.take(10)], [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]);
  });

  suite.test('handles negative values', async (t) => {
    t.deepEqual([...range.take(-10)], []);
  });

  suite.test('takes 0', async (t) => {
    t.deepEqual([...range.take(0)], []);
  });
});
