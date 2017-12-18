const sI = require('@webos/timers').setImmediate;

const run = (count, timeout, start, name) => count-- < 0 ?
  console.log(`${name} perf ::: `, new Date - start) :
  timeout(_ => run(count, timeout, start, name), 0);

const testTimeout = (count, timeout, name) =>
  timeout(_ => run(count, timeout, new Date(), name), 0);

testTimeout(1000, setTimeout, 'Native setTimeout');     // 1375 ::: milliseconds

testTimeout(1000, process.nextTick, 'Native nextTick'); // 3    ::: milliseconds

testTimeout(1000, setImmediate, 'Native setImmediate'); // 3    ::: milliseconds

// @webos/timers

testTimeout(1000, sI, '@webos/timers setImmediate');    // 1    ::: milliseconds
