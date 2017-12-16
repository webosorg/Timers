export default class ReusableLazyPromise {
  constructor(executor) {
    this.__executor__ = executor;
  }

  promiseCreator() {
    return this.__promise__ = new Promise((resolve, reject) => {
      this.__resolve__ = resolve;
      this.__reject__ = reject;
      return this.__executor__(resolve, reject)
    });
  }

  then(onFulfilled, onRejected) {
    return this.promiseCreator().then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.__promise__.catch(onRejected);
  }

  resolve(value) {
    return this.checkAndCreate() && this.__resolve__(value);
  }

  reject(reason) {
    return this.checkAndCreate() && this.__reject__(reason);
  }

  finally(value) {
    return this.checkAndCreate() && this.__promise__.finally(value);
  }

  checkAndCreate() {
    !this.__promise__ && this.promiseCreator();
    return true;
  }
}
