/**
 * Wraps a promise for synchronous status query.
 *
 * fulfilled - The action relating to the promise succeeded
 * rejected - The action relating to the promise failed
 * pending - Hasn't fulfilled or rejected yet
 * settled - Has fulfilled or rejected
 *
 * @param  {Promise} _promise A promise to wrap
 * @return {Promise}          Wrapped promise
 */
export function StatefulPromise(_promise) {
  if (_promise.pending) return _promise;

  let stateful_promise = _promise
    .then(value => {
      stateful_promise.pending = false;
      stateful_promise.fulfilled = true;
      stateful_promise.settled = true;
      return value;
    })
    .catch(error => {
      stateful_promise.pending = false;
      stateful_promise.rejected = true;
      stateful_promise.settled = true;
      throw error;
    });

  stateful_promise.pending = true;
  stateful_promise.rejected = false;
  stateful_promise.fulfilled = false;
  stateful_promise.settled = false;

  return stateful_promise;
}
