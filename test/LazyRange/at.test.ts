import tap from 'tap';
import LazyRange from '../../src/LazyRange';

tap.test('LazyRange#at', async (suite) => {
  const range = new LazyRange(0, 20, 2);
  suite.test('gets the element at the given index', async (t) => {
    t.equal(range.at(5), 10);
  });

  suite.test('returns undefined when out of range', async (t) => {
    t.equal(range.at(10), undefined);
    t.equal(range.at(30), undefined);
  });

  suite.test('returns undefined when range length is 0', async (t) => {
    t.equal(new LazyRange(0, 20, -2).at(5), undefined);
    t.equal(new LazyRange(0).at(0), undefined);
  });

  [[], 0.5, {}, 'a'].forEach((value: any) => {
    suite.test('returns undefined when non-integers are passed in', async (t) => (
      t.equal(new LazyRange(10).at(value), undefined)
    ));
  });
});
