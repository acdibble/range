import tap from 'tap';
import LazyRange from '../../src/LazyRange';

tap.test('length', async (suite) => {
  ([
    [[10], 10],
    [[0, 10, -1], 0],
    [[0], 0],
  ] as [([number] | [number, number, number]), number][]).forEach(([[a, b, c], length]) => {
    suite.test('gets the proper length', async (t) => (
      // @ts-ignore
      t.equal(new LazyRange(a, b, c).length, length)
    ));
  });
});
