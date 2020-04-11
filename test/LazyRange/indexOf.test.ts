import tap from 'tap';
import LazyRange from '../../src/LazyRange';

tap.test('LazyRange#indexOf', async (suite) => {
  const range = new LazyRange(0, 20, 2);
  const numbers = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];

  numbers.forEach((num, index) => {
    suite.test('returns the index of an element if found', async (t) => (
      t.equal(range.indexOf(num), index)
    ));
  });

  [-1, 1, 20].forEach((number) => {
    suite.test('returns -1 if no element is found', async (t) => (
      t.equal(range.indexOf(number), -1)
    ));
  });

  suite.test('returns -1 if no element is found', async (t) => {
    t.equal(new LazyRange(0, 1, -1).indexOf(1), -1);
  });
});
