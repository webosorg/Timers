import setImmediate from './setImmediate';

import ReusableLazyPromise from './utils/reusableLazyPromise';

const nextTick = _ => new ReusableLazyPromise(res => setImmediate(res));

export default nextTick;
