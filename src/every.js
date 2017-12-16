import setImmediate, { clearImmediate } from './setImmediate';

import ReuseLazyPromise from './utils/reuseLazyPromise';

function every(fn, time = 0, iterations = Infinity) {
  const rPromise = new ReuseLazyPromise(res => {
    const timerID = setInterval(
      _ => iterations-- > 0 ? fn() : (rPromise.stop() & res()), time
    );

    rPromise.stop = _ => clearInterval(timerID);
  });

  const rPromiseThen = (...args) => rPromise.then(...args) && rPromise;

  rPromise.done = rPromiseThen;
  rPromise.run = rPromiseThen;

  return rPromise;
}

export default every;
