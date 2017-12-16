import ReuseLazyPromise from './utils/reuseLazyPromise';

import nextTick from './nextTick';

const sleep = (time = 0) => time === 0 ? nextTick() : new ReuseLazyPromise(res => setTimeout(res, time));

export default sleep;
