import tap from 'tap';
import LazyRange from '../../src/LazyRange';

tap.test('LazyRange#toString', async (suite) => {
  suite.test('returns [object LazyRange]', async (t) => {
    t.equal(Object.prototype.toString.call(new LazyRange(0)), '[object LazyRange]');
  });

  suite.test('returns [object LazyRange]', async (t) => {
    t.equal(new LazyRange(0).toString(), '[object LazyRange]');
  });
});
