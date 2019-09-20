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

#### Slice:
```python
>>> range(0, 20, 2)[4:-3:2]
range(8, 14, 4)
```
```javascript
> new Range(0, 20, 2).slice(4, -3, 2);
Range { start: 8, step: 4, stop: 14, length: 2 }
```

#### Length:
```python
>>> len(range(10))
10
```
```javascript
> new Range(10).length;
10
```

#### Presence:
```python
>>> 10 in range(0, 20, 2)
True
```
```javascript
> new Range(0, 20, 2).has(10);
true
```

#### Lookup by index:
```python
>>> range(1, 19, 3)[5]
16
```
```javascript
> new Range(1, 19, 3).at(5);
16
```

#### Find index:
```python
>>> range(1, 19, 3).index(13)
4
```
```javascript
> new Range(1, 19, 3).indexOf(13);
4
```
