# @webos/timers

[![(a histogram of downloads)](https://nodei.co/npm-dl/@webos/timers.png)](https://www.npmjs.com/package/@webos/timers)

## Synopsys

Abstraction layer on ```setTimeout``` and ```setInterval```, implementation of ```setImmediate```.

## Introduction

There are six functions in this library.

### sleep

##### (milliseconds: optional (default 0)) -> Reusable Lazy Promise

#### Usage

1) 
```js
sleep(3000).then(_ => console.log('Log ::: After ~3000 milliseconds'));
```

2)
```js
const sleep_five_seconds = sleep(5000);
sleep_five_seconds.then(_ => console.log('Log ::: After ~5 seconds'));
//
//
sleep_five_seconds.then(...) // it can be reused many times
```

```sleep``` uses ```setTimeout``` wrapped with reusable lazy promise
( when 0 or nothing is passed, it calls ```setImmediate``` instead of  ```setTimeout```);

### nextTick

##### () -> Reusable Lazy Promise

#### Usage

1) 
```js
nextTick().then(_ => console.log(‘Log ::: immediately’));
```

2)
```js
const next_tick = nextTick();
next_tick.then(_ => console.log(‘Log ::: immediately’));
//
//
next_tick.then(...); // it can be reused many times
```

```nextTick``` uses ```setImmediate``` wrapped with reusable lazy promise.

### every

##### (fn: required, milliseconds: optional (default 0), iterations: optional (default Infinity)) -> Reusable Lazy Promise

#### Usage

1) 
```js
every(_ => console.log(‘Log ::: every ~500 milliseconds’), 500, 20).then(_ => console.log(‘Log ::: I have finished’));
```

2)
```js
const log_every_ten_milliseconds = every(_ => console.log(‘Log ::: every ~10 milliseconds’), 500, 4);
log_every_ten_milliseconds.run();
// Log ::: every ~10 milliseconds
// Log ::: every ~10 milliseconds
log_every_ten_milliseconds.stop();
log_every_ten_milliseconds.run();
// Log ::: every ~10 milliseconds
// Log ::: every ~10 milliseconds
```

```every``` uses ```setInterval``` wrapped with reusable lazy promise.
So, it means that every next call of fn will be after inputted time. ( When execution time of fn is not bigger than inputted time ).
For example, let’s consider that we have an application of ```every``` like this.

```js
every(fn, 500, 4).then(...)
```

And, let’s imagine that the execution time of fn is ~100 milliseconds. In this case it will work like this.

![alt every](https://raw.githubusercontent.com/webosorg/Timers/master/images_for_readme/every.png)

As we see, all function will be called after 500 milliseconds, and then each next function will be called after 400 milliseconds from the end of the previous function.
If you want to call every next function after inputted time plus execution time of function you can use ```loopDelayBetween``` instead of ```every```.

### loopDelayBetween

##### (fn: required, milliseconds: optional (default 0), iterations: optional (default Infinity)) -> Reusable Lazy Promise

#### Usage

1) 
```js
loopDelayBetween(_ => console.log(‘Log ::: every ~500 milliseconds’), 500, 20).then(_ => console.log(‘Log ::: I have finished’));
```

2)
```js
const log_every_ten_milliseconds = every(_ => console.log(‘Log ::: every ~10 milliseconds’), 500, 4);
log_every_ten_milliseconds.run();
// Log ::: every ~10 milliseconds
// Log ::: every ~10 milliseconds
log_every_ten_milliseconds.stop();
log_every_ten_milliseconds.run();
// Log ::: every ~10 milliseconds
// Log ::: every ~10 milliseconds
```

Unlike every, ```loopDelayBetween``` uses recursive ```setTimeout``` or ```setImmediate``` ( when inputted time is 0 ) instead of ```setInterval```.
So, it will call every next function after previous function execution time plus inputted time.
For example, suppose that we have an application of ```loopDelayBetween``` like this.

```js
loopDelayBetween(fn, 500, 4).then(...)
```

And, let’s imagine that execution time of fn is ~100 milliseconds’. In this case it will work like this.

![alt loopDelayBetween](https://raw.githubusercontent.com/webosorg/Timers/master/images_for_readme/loopDelayBetween.png)

### setImmediate

[MDN](https://developer.mozilla.org/ru/docs/Web/API/Window/setImmediate) - This method is used to break up long running operations and run a callback function immediately after
the browser has completed other operations such as events and display updates.

The ```setImmediate``` problem is that it’s not part of any specification and is not supported by many browsers.

[MDN](https://developer.mozilla.org/ru/docs/Web/API/Window/setImmediate)

![alt setImmediate_](https://raw.githubusercontent.com/webosorg/Timers/master/images_for_readme/setImmediate_.png)

```setImmediate``` is similar to ```setTimeout(..., 0)```. But ```setTimeout``` have minimum timeout (~4ms).
It means that when we call ```setTimeout(..., 0)``` it will work after ~4ms.

[MDN](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)

[Historically](http://code.google.com/p/chromium/issues/detail?id=792#c10) browsers implement setTimeout() "clamping": successive setTimeout() calls with delay smaller than the "minimum delay" limit are forced to use at least the minimum delay.
The minimum delay, DOM_MIN_TIMEOUT_VALUE, is 4 ms (stored in a preference in Firefox: dom.min_timeout_value), with a DOM_CLAMP_TIMEOUT_NESTING_LEVEL of 5ms.
In fact, 4ms is [specified by the HTML5 spec](http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#timers) and is consistent across browsers released in 2010 and onward. Prior to (Firefox 5.0 / Thunderbird 5.0 / SeaMonkey 2.2), the minimum timeout value for nested timeouts was 10 ms.
In addition to "clamping", the timeout can also fire later when the page (or the OS/browser itself) is busy with other tasks.
To implement a 0 ms timeout in a modern browser, you can use [window.postMessage()](https://developer.mozilla.org/ru/docs/Web/API/Window/postMessage) as [described here](http://dbaron.org/log/20100309-faster-timeouts).
Browsers including Internet Explorer, Chrome, Safari, and Firefox store the delay as a 32-bit signed Integer internally. This causes an Integer.

There are some implementations of this, like [setZeroTimeout](https://dbaron.org/log/20100309-faster-timeouts) or [setImmediate](https://developer.mozilla.org/ru/docs/Web/API/Window/setImmediate).
The best polyfill of ```setImmediate``` is this [polyfill](https://github.com/YuzuJS/setImmediate). They use ```postMessage```, ```MessageChannel```, even "script onreadystatechange" for reaching maximum support in old browsers.

In this library, the implementation of ```setImmediate``` uses ```Promise.resolve()```.
It’s the fastest way, but writing ```setImmediate``` polyfill by using ```Promise.resolve()``` has one problem.
It’s the following: ```Promise``` polyfill uses setImmediate inside, if it exists.

[promise-polyfill](https://github.com/taylorhakes/promise-polyfill)

![alt promise-polyfill](https://raw.githubusercontent.com/webosorg/Timers/master/images_for_readme/promise_polifill.png)

So, if we write ```setImmediate``` polyfill without using checkings, cyclic calls will occur.
For avoiding this the implementation of ```setImmediate``` in this library checks if the browser supports native ```Promise```,
If so, it uses ```Promise.resolve()```, otherwise uses ```setTimeOut(..., 0)```. [Can I use...](https://caniuse.com/#feat=promises) says that ~90% of all browsers support native ```Promise```.
So, in nearly 90% of all browsers this implementation of ```setImmediate``` will work much more faster than any other implementation.
But, of course, in 10% of browsers ```setTimeout(..., 0)``` will work.

====

##### (fn: required) -> timerID

#### Usage

```js
const timerID = setImmediate(fn)
```

### clearImmediate

##### (timerID) -> Boolean

#### Usage

```js
const timerID = setImmediate(fn);

clearImmediate(timerID);
```

## License

MIT






   
