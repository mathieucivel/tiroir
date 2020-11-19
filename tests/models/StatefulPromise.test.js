import {StatefulPromise} from '../../src/index.js';
import {delay} from '../../src/index.js';

test('should have correct states when pending', () => {
  const stp = StatefulPromise(delay(20));
  expect(stp.pending).toBe(true);
  expect(stp.rejected).toBe(false);
  expect(stp.fulfilled).toBe(false);
  expect(stp.settled).toBe(false);
});

test('should have correct states when fulfilling', async done => {
  const stp = StatefulPromise(delay(20));
  await delay(30);
  expect(stp.pending).toBe(false);
  expect(stp.rejected).toBe(false);
  expect(stp.fulfilled).toBe(true);
  expect(stp.settled).toBe(true);
  done();
});

test('should have correct states on rejection', async done => {
  const stp = StatefulPromise(delay(20).then(() => {
    throw 'error';
  }));
  stp.catch(() => {});
  await delay(30);
  expect(stp.pending).toBe(false);
  expect(stp.rejected).toBe(true);
  expect(stp.fulfilled).toBe(false);
  expect(stp.settled).toBe(true);
  done();
});
