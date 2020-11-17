import {TaskPool} from '../../src/index';
import {Task} from '../../src/index';
import {delay} from '../../src/index';

const delayTask = Task(async ms => delay(ms));

test('should run an unique task', async done => {
  const pool = TaskPool();
  expect(pool.getRunnedCount()).toBe(0);
  expect(pool.getWaitingCount()).toBe(0);
  expect(pool.getPendingCount()).toBe(0);
  pool.add(delayTask, [100]);
  await delay(10);
  expect(pool.getRunnedCount()).toBe(0);
  expect(pool.getWaitingCount()).toBe(0);
  expect(pool.getPendingCount()).toBe(1);
  await delay(100);
  expect(pool.getRunnedCount()).toBe(1);
  expect(pool.getWaitingCount()).toBe(0);
  expect(pool.getPendingCount()).toBe(0);
  done();
});
