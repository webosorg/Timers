const timeouts = {};
let timerID = 1; // In specification timer ID should be greater then 0

const isPromiseNative = typeof Promise !== 'undefined' &&
  Promise.toString().includes('[native code]');

const setTimeoutWithZero = (cb, ...args) => setTimeout(cb, 0, ...args);

const setImmediate = isPromiseNative ? (cb, ...args) => {

  const fn = typeof cb !== 'function' ? new Function('' + cb) : cb;

  const currentTimerID = ++timerID;
  timeouts[currentTimerID] = fn;

  Promise.resolve().then(
    _ => timeouts[currentTimerID] &&
    (args.length ? fn(...args) : fn()) &
    clearImmediate(currentTimerID)
  );

  return currentTimerID;
} : setTimeoutWithZero;

const clearImmediate = isPromiseNative ?
  timerID => (delete timeouts[timerID]) : clearTimeout;

export default setImmediate;

export { setImmediate, clearImmediate };
