import tap from 'tap';
import LazyRange from '../../src/LazyRange';

tap.test('LazyRange#takeWhile', async (suite) => {
  const range = new LazyRange(0, 100, 2);

  suite.test('returns items until it finds a non-match', async (t) => {
    t.deepEqual([...range.takeWhile((n) => n % 2 === 0)], [...range]);
  });

  suite.test('returns items until it finds a non-match', async (t) => {
    t.deepEqual([...range.takeWhile((n) => n < 10)], [0, 2, 4, 6, 8]);
  });

  suite.test('knows that done is done', async (t) => {
    const it = range.takeWhile(() => false);
    t.deepEqual(it.next(), { value: undefined, done: true });
    t.deepEqual(it.next(), { value: undefined, done: true });
    t.deepEqual(it.next(), { value: undefined, done: true });
  });
});
