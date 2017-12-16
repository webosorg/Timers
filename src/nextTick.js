import setImmediate from './setImmediate';

import ReuseLazyPromise from './utils/reuseLazyPromise';

const nextTick = _ => new ReuseLazyPromise(res => setImmediate(res));

export default nextTick;
