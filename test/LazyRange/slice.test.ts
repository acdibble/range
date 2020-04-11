import tap from 'tap';
import LazyRange from '../../src/LazyRange';

tap.test('LazyRange#slice', async (suite) => {
  const range = new LazyRange(0, 20, 2);

  suite.test('grabs all the elements after a start index', async (t) => {
    t.true(range.slice(5).equals(new LazyRange(10, 20, 2)));
  });

  suite.test('supports a negative start number', async (t) => {
    t.true(range.slice(-2).equals(new LazyRange(16, 20, 2)));
  });

  suite.test('supports a very negative start number', async (t) => {
    t.true(range.slice(-1112).equals(range));
  });

  suite.test('supports a start and an end', async (t) => {
    t.true(range.slice(1, 3).equals(new LazyRange(2, 6, 2)));
  });

  suite.test('behaves correctly when start > end', async (t) => {
    t.true(range.slice(4, 3).equals(new LazyRange(8, 6, 2)));
  });

  suite.test('behaves correctly when start = end', async (t) => {
    t.true(range.slice(4, 4).equals(new LazyRange(8, 8, 2)));
  });

  suite.test('behaves correctly when end < 0', async (t) => {
    t.true(range.slice(2, -3).equals(new LazyRange(4, 14, 2)));
  });

  suite.test('behaves correctly when end very < 0', async (t) => {
    t.true(range.slice(2, -300).equals(new LazyRange(4, 0, 2)));
  });

  suite.test('accepts a step multiplier', async (t) => {
    t.true(range.slice(0, -1, 3).equals(new LazyRange(0, 18, 6)));
  });

  suite.test('accepts a step negative multiplier', async (t) => {
    t.true(range.slice(0, -1, -3).equals(new LazyRange(0, 18, -6)));
  });

  suite.test('accepts null/undefined in the first position', async (t) => {
    t.true(range.slice(null, -1, 2).equals(new LazyRange(0, 18, 4)));
  });

  suite.test('accepts null/undefined in the second position', async (t) => {
    t.true(range.slice(0, null, 2).equals(new LazyRange(0, 18, 4)));
  });

  suite.test('accepts null/undefined in the third position', async (t) => {
    // @ts-ignore
    t.true(range.slice(2, -3, null).equals(new LazyRange(4, 14, 2)));
  });
});
