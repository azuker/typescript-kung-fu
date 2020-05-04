export interface Model {
  withState<T>(state: T): Model & T;
}

export function createModel(): Model {
  // object literal is good enough as an example
  return {
    withState<T>(this: Model, state: T) {
      return Object.assign(this, state);
    },
  };
}
