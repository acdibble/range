## Python 3 `range()` in JS

This is a memory-efficient range class. It only stores the start, stop, step,
and length for a range. The values are generated as necessary via
`Symbol.iterator`. It works with any ES2015 compliant browsers.

Additionally, it's been adapted to match expected JavaScript behavior, e.g.
using `LazyRange#at` to look up an out of bounds index will return undefined, rather
than throwing an error.

### Examples:

```javascript
const LazyRange = require('@acdibble/lazy-range');
```
or with modules:
```javascript
import LazyRange from '@acdibble/lazy-range';
```

#### Just a stop parameter:
```python
>>> list(range(10))
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

```javascript
> [...new LazyRange(10)];
[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
> Array.from(new LazyRange(10));
[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

#### With start and stop parameter:
```python
>>> list(range(-10, 0))
[-10, -9, -8, -7, -6, -5, -4, -3, -2, -1]
```

```javascript
> [...new LazyRange(-10, 0)];
[ -10, -9, -8, -7, -6, -5, -4, -3, -2, -1 ]
```

#### With start, stop, and step parameters:
```python
>>> list(range(1, 100, 25))
[1, 26, 51, 76]
```

```javascript
> [...new LazyRange(1, 100, 25)];
[ 1, 26, 51, 76 ]
```

#### Iteration:
```python
>>> sum = 0
>>> for x in range(10):
...     sum += x
...
>>> sum
45
```
```javascript
> let sum = 0;
undefined
> for (const x of new LazyRange(10)) {
...   sum += x;
... }
45
```
or
```javascript
> [...new LazyRange(10)].reduce((acc, num) => acc + num, 0);
45
```
#### Equality:
```python
range(0, 3, 2) == range(0, 4, 2)
True
```

```javascript
> new LazyRange(0, 3, 2).equals(new LazyRange(0, 4, 2))
true
```

#### Slice:
```python
>>> range(0, 20, 2)[4:-3:2]
range(8, 14, 4)
```
```javascript
> new LazyRange(0, 20, 2).slice(4, -3, 2);
LazyRange { start: 8, step: 4, stop: 14, length: 2 }
```

#### Length:
```python
>>> len(range(10))
10
```
```javascript
> new LazyRange(10).length;
10
```

#### Presence:
```python
>>> 10 in range(0, 20, 2)
True
```
```javascript
> new LazyRange(0, 20, 2).has(10);
true
```

#### Lookup by index:
```python
>>> range(1, 19, 3)[5]
16
```
```javascript
> new LazyRange(1, 19, 3).at(5);
16
```

#### Find index:
```python
>>> range(1, 19, 3).index(13)
4
```
```javascript
> new LazyRange(1, 19, 3).indexOf(13);
4
```
