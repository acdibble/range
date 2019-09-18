## Python `range()` in JS

A work in progress.

### Examples:

#### Just stop:
```python
>>> list(range(10))
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

```javascript
> [...new Range(10)];
[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

#### Start and stop:
```python
>>> list(range(-10, 0))
[-10, -9, -8, -7, -6, -5, -4, -3, -2, -1]
```

```javascript
> [...new Range(-10, 0)];
[ -10, -9, -8, -7, -6, -5, -4, -3, -2, -1 ]
```

#### Start, stop, step:
```python
>>> list(range(1, 100, 25))
[1, 26, 51, 76]
```

```javascript
> [...new Range(1, 100, 25)];
[ 1, 26, 51, 76 ]
```

#### Additional functionality:
In order to support both `xrange()` and `range()`, I've added a fourth parameter, which can take an options object. This allows for lazy and eager evaluation wrapped into one API:
```javascript
> [...new Range(10, { lazy: true })];
[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

Custom toString tag:
```javascript
> Object.prototype.toString.call(new Range(10));
'[object Range]'
```

TODO:
More member functions, e.g. slice, index lookup(?)...
