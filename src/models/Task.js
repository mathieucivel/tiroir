const DEFAULT = {
  pending: false,
  rejected: false,
  fulfilled: false,
  settled: false
};

/**
 * Wrap an async function to add promise state properties
 * (pending, fulfilled, rejected, settled)
 *
 * @param  {Function} _function   A function returning a promise
 * @param  {Object}   _this       Optional object to bind to the task
 * @return {Object}
 */
export function Task(_function, _this) {
  let task = Object.assign({}, DEFAULT);

  function run() {
    if (task.pending) {
      throw new Error('This task is already pending');
    }

    task.pending = true;
    task.rejected = false;
    task.fulfilled = false;
    task.settled = false;

    return _function.apply(_this || this, arguments)
      .then(value => {
        task.pending = false;
        task.fulfilled = true;
        task.rejected = false;
        task.settled = true;
        return value;
      })
      .catch(error => {
        task.pending = false;
        task.fulfilled = false;
        task.rejected = true;
        task.settled = true;
        throw error;
      });
  }

  function clone() {
    return Task(_function, _this);
  }

  function reset() {
    Object.assign(task, DEFAULT);
  }

  Object.defineProperties(task, {
    run: {value: run},
    clone: {value: clone},
    reset: {value: reset}
  });

  return task;
}
