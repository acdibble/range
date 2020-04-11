import tap from 'tap';
import LazyRange from '../../src/LazyRange';

tap.test('LazyRange#equals', async (suite) => {
  suite.test('finds ranges equivalent', async (t) => {
    t.true(new LazyRange(0).equals(new LazyRange(2, 1, 3)));
    t.true(new LazyRange(0, 3, 2).equals(new LazyRange(0, 4, 2)));
    t.true(new LazyRange(10).equals(new LazyRange(0, 10, 1)));
    t.true(new LazyRange(0, 20, -2).equals(new LazyRange(0, 0)));
  });

  suite.test('finds ranges nonequivalent (length difference)', async (t) => {
    t.false(new LazyRange(10).equals(new LazyRange(9)));
  });

  suite.test('finds ranges nonequivalent (different values)', async (t) => {
    t.false(new LazyRange(-9, 2, 1).equals(new LazyRange(11)));
  });

  suite.test('returns false for non-range objects', async (t) => {
    t.false(new LazyRange(10).equals(1));
  });
});
