// unsorted things

// ------------------------------------

// Promise allSettled utility functions with accurate typing:

async function a() {
  return 1;
}

async function b() {
  return "2";
}

async function main() {
  const tasks = await Promise.allSettled([a(), b()]);

  const [org1, org2] = tasks;
  // const [org1, org2, zzz2] = tasks; ---> zzz2 error

  const [o1, o2] = logFailedPromises(tasks); // return the same
  // const [o1, o2, mmm2] = logFailedPromises(tasks); --> mmm2 error

  const [o3, o4] = logFailedPromisesAndRethrow(tasks); // ordered fulfilled types only
  // const [o3, o4, nnn2] = logFailedPromisesAndRethrow(tasks); --> nnn2 error

  const [o5, o6] = getFulfilled(tasks); // each a union of possible fulfilled types only
  // const [o5, o6, foo] = getFulfilled(tasks); --> foo error

  const [o7, o8] = getFailed(tasks);  // failed results only
  // const [o7, o8, bar] = getFailed(tasks); --> bar error
}

// no need for this tuple map recursion, see the simplified version below
// type RemoveRejected2<T extends readonly PromiseSettledResult<unknown>[]> =
//   T extends [infer U]
//     ? [Exclude<U, PromiseRejectedResult>]
//     : T extends [infer U, ...infer V extends readonly PromiseSettledResult<unknown>[]]
//       ? [Exclude<U, PromiseRejectedResult>, ...RemoveRejected<V>]
//       : never;

type RemoveRejected<T extends readonly PromiseSettledResult<unknown>[]> = {
  [P in keyof T]: Exclude<T[P], PromiseRejectedResult>
}

type RemoveFulfilled<T extends readonly PromiseSettledResult<unknown>[]> = MapKeysTo<T, PromiseRejectedResult>

type ToFulfilledUnion<T extends readonly PromiseSettledResult<unknown>[]> = MapKeysTo<T, RemoveRejected<T>[number]>

type MapKeysTo<T extends readonly PromiseSettledResult<unknown>[], K> = {
  [P in keyof T]: K
}

function logFailedPromises<T extends readonly PromiseSettledResult<unknown>[]>(values: T): T {
  return values;
}

function logFailedPromisesAndRethrow<T extends readonly PromiseSettledResult<unknown>[]>(values: T): RemoveRejected<T> {
  return values as any;
}

function getFulfilled<T extends readonly PromiseSettledResult<unknown>[]>(values: T): ToFulfilledUnion<T> {
  return values as any;
}

function getFailed<T extends readonly PromiseSettledResult<unknown>[]>(values: T): RemoveFulfilled<T> {
  return values as any;
}

// ------------------------------------
