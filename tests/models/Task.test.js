import {Task} from '../../src/index.js';
import {delay} from '../../src/index.js';

test('should return an object with a run method', () => {
  const task = Task(() => delay(20));
  expect(typeof task).toBe('object');
  expect(typeof task.run).toBe('function');
  expect(task.pending).toBe(false);
  expect(task.rejected).toBe(false);
  expect(task.fulfilled).toBe(false);
  expect(task.settled).toBe(false);
});

test('should be bindable', async done => {
  const task = Task(async function() {
    if (!this.test) throw 'Not bindable !';
  }, {test: true});
  expect(() => task.run()).not.toThrow();
  done();
});

test('should accepts parameters', async done => {
  const task = Task(async ms => delay(ms));
  task.run(30);
  await delay(20);
  expect(task.pending).toBe(true);
  expect(task.rejected).toBe(false);
  expect(task.fulfilled).toBe(false);
  expect(task.settled).toBe(false);
  await delay(30);
  expect(task.pending).toBe(false);
  expect(task.rejected).toBe(false);
  expect(task.fulfilled).toBe(true);
  expect(task.settled).toBe(true);
  done();
});

test('should have properties updated through its lifecycle', async done => {
  const task = Task(() => delay(20));
  task.run();
  expect(task.pending).toBe(true);
  expect(task.rejected).toBe(false);
  expect(task.fulfilled).toBe(false);
  expect(task.settled).toBe(false);
  await delay(20);
  expect(task.pending).toBe(false);
  expect(task.rejected).toBe(false);
  expect(task.fulfilled).toBe(true);
  expect(task.settled).toBe(true);
  done();
});

test('should be callable in serial', async done => {
  const task = Task(() => delay(20));
  await task.run();
  task.run();
  expect(task.pending).toBe(true);
  expect(task.rejected).toBe(false);
  expect(task.fulfilled).toBe(false);
  expect(task.settled).toBe(false);
  await delay(20);
  expect(task.pending).toBe(false);
  expect(task.rejected).toBe(false);
  expect(task.fulfilled).toBe(true);
  expect(task.settled).toBe(true);
  done();
});

test('should not be callable in parallel', async done => {
  const task = Task(() => delay(20));
  task.run();
  await delay(10);
  expect(() => task.run()).toThrow();
  done();
});
