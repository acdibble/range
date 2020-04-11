import tap from 'tap';
import LazyRange from '../../src/LazyRange';

tap.test('LazyRange#has', async (suite) => {
  const range = new LazyRange(0, 20, 2);
  const numbers = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];

  numbers.forEach((number) => {
    suite.test('returns true if an element is found', async (t) => {
      t.true(range.has(number));
    });
  });

  [-1, 1, 11].forEach((number) => {
    suite.test('returns false if an element is not found', async (t) => {
      t.false(range.has(number));
    });
  });

  suite.test('returns false if an element is not found', async (t) => {
    t.false(new LazyRange(0, 20, -2).has(10));
  });

  suite.test('returns false if an element is not found', async (t) => {
    t.false(new LazyRange(0, 20, -2).has(0));
    t.false(new LazyRange(0).has(0));
  });
});
