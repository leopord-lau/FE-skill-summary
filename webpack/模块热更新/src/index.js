function MyPromise(callback) {
  const pending = "pending";
  const fullfilled = "fullfilled";
  const rejected = "reject";

  this.state = pending;

  this.value = null;

  this.reason = null;

  this.fullfilledCallback = [];
  this.rejectedCallback = [];

  this.resolve = (data) => {
    setTimeout(() => {
      if (this.state == pending) {
        this.state = fullfilled;
        this.value = data;
        this.fullfilledCallback.map((fn) => fn(this.value));
      }
    });
  };

  this.reject = (reason) => {
    setTimeout(() => {
      if (this.state == pending) {
        this.state = rejected;
        this.value = reason;
        this.rejectedCallback.map((fn) => fn(this.value));
      }
    });
  };

  this.then = function (successFn, errorFn) {
    successFn && this.fullfilledCallback.push(successFn);
    errorFn && this.rejectedCallback.push(errorFn);
    return this;
  };

  this.catch = function (errorFn) {
    errorFn && this.rejectedCallback.push(errorFn);
  };

  callback(this.resolve, this.reject);
}

new MyPromise((resolve, reject) => {
  // resolve('my promise resolve');
  setTimeout(() => {
    reject("my promise reject");
  }, 1000);
})
  .then(
    (data) => {
      console.log(data);
    }
    //   ,
    //   (err) => {
    //     console.log(err);
    //   }
  )
  .catch((err) => {
    console.log(err);
  });
