import setImmediate, { clearImmediate } from './setImmediate';

import ReusableLazyPromise from './utils/reusableLazyPromise';

const loopDelayBetween = (fn, time = 0, iterations = Infinity) => {
  const rPromise = new ReusableLazyPromise(res => {

    let timerID;

    const [ timeout, stop ] = time === 0 ?
          [ setImmediate, _ => clearImmediate(timerID) ] :
          [ setTimeout, _ => clearTimeout(timerID) ];

    rPromise.stop = stop;

    const updateTimerID = (run, time) => (timerID = timeout(run, time));

    const run = _ => iterations-- > 0 ? fn() & updateTimerID(run, time) : res();

    updateTimerID(run, time);
  });

  const rPromiseThen = (...args) => rPromise.then(...args) && rPromise;

  rPromise.run = rPromiseThen;

  return rPromise;
}

export default loopDelayBetween;
