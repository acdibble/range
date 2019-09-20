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
> for (const x of new Range(10)) {
... sum += x;
... }
45
```
or
```javascript
> new Range(10).toArray().reduce((acc, num) => acc + num, 0);
45
```
#### Equality:
```python
range(0, 3, 2) == range(0, 4, 2)
True
```

```javascript
> new Range(0, 3, 2).equals(new Range(0, 4, 2))
true
```
