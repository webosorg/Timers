import ReusableLazyPromise from './utils/reusableLazyPromise';

import nextTick from './nextTick';

const sleep = (time = 0) => time === 0 ? nextTick() : new ReusableLazyPromise(res => setTimeout(res, time));

export default sleep;
