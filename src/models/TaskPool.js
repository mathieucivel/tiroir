const DEFAULT = {
  limit: 5
};

/**
 * Run tasks concurently with a maximum number of parralel
 * execution at a time.
 * Tasks are automaticaly runned in the order they are added.
 *
 * @param  {Object} _options  Options object
 * @param  {Number} _options.limit  Maximum number of pending task at a time
 * @return {Object}
 */
export function TaskPool(_options = {}) {
  const pool = Object.assign({}, DEFAULT, _options);

  let runned = 0; //amount of task runned and settled since app start
  let queue = []; //new tasks are added in index 0
  let count = 0; //number of task added since app start

  /* Add a task to the pool queue */
  function add(_task = null, _params = []) {
    if (!_task || typeof _task.run !== 'function') throw new Error('Invalid task');
    if (!Array.isArray(_params)) throw new Error('Invalid task parameters, should be an array');
    const promise = new Promise((resolve, reject) => {
      const task = _task.clone();
      task.id = count++;
      queue.unshift({task, params: _params, resolve, reject});
      _update();
    });
    queue[0].promise = promise;
    return promise;
  }

  /* Get the number of task waiting to be executed */
  function getRunnedCount() {
    return runned;
  }

  /* Get the number of task waiting to be executed */
  function getWaitingCount() {
    //return queue.reduce((sum, t) => !(t.task.pending && t.task.settled) && ++sum, 0);
    let result = 0;
    for (let task of queue) {
      if (!task.task.pending && !task.task.settled) result++;
    }
    return result;
  }

  /* Get current pending tasks count */
  function getPendingCount() {
    //return queue.reduce((sum, t) => t.task.pending && ++sum, 0);
    let result = 0;
    for (let task of queue) {
      if (task.task.pending) result++;
    }
    return result;
  }

  /* Return a promise that resolve when the current pool queue becomes empty */
  function emptied() {
    if (queue.length === 0) return Promise.resolve(runned);
    return queue[0].promise.then(runned);
  }

  //Update queue (remove settled and run new tasks)
  function _update() {
    let pendingCount = getPendingCount();

    for (let i = queue.length; i--;) {
      const task = queue[i].task;
      const params = queue[i].params;
      const resolve = queue[i].resolve;
      const reject = queue[i].reject;
      if (task.settled) { //remove settled tasks
        runned++;
        queue.splice(i, 1);
        continue;
      }
      if (task.pending) {
        continue;
      }
      if (pendingCount < pool.limit) {
        task.run(...params).then(() => {
          resolve(...params);
          _update();
        }).catch(reject);
        pendingCount++;
        continue;
      }
      break;
    }
  }

  Object.defineProperties(pool, {
    add: {value: add},
    emptied: {value: emptied},
    getRunnedCount: {value: getRunnedCount},
    getWaitingCount: {value: getWaitingCount},
    getPendingCount: {value: getPendingCount}
  });

  return pool;
}
