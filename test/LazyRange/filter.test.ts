import tap from 'tap';
import LazyRange from '../../src/LazyRange';

tap.test('LazyRange#filter', async (suite) => {
  const range = new LazyRange(0, 100, 2);

  suite.test('returns all elements if fn always returns true', async (t) => {
    t.deepEqual([...range.filter(() => true)], [...range]);
  });

  suite.test('returns all elements where fn returns true', async (t) => {
    t.deepEqual([...range.filter((n) => n < 10)], [0, 2, 4, 6, 8]);
  });

  suite.test('puts the index as the second paramter', async (t) => {
    const r = new LazyRange(10);
    const indices: number[] = [];
    const cb = (_: number, i: number): boolean => {
      indices.push(i);
      return true;
    };
    // eslint-disable-next-line no-unused-expressions
    [...r.filter(cb)];
    t.deepEqual(indices, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  /* eslint-disable no-unused-expressions */
  suite.test('puts the range as the third parameter', async (t) => {
    let obj: LazyRange;
    const rng = new LazyRange(1);
    // @ts-ignore
    [...rng.filter((a, b, r) => {
      obj = r;
      return true;
    })];
    // @ts-ignore
    t.is(rng, obj);
  });
  /* eslint-enable no-unused-expressions */

  suite.test('properly terminates', async (t) => {
    const it = new LazyRange(0).filter(() => true);
    t.deepEqual(it.next(), { value: undefined, done: true });
    t.deepEqual(it.next(), { value: undefined, done: true });
    t.deepEqual(it.next(), { value: undefined, done: true });
  });
});
