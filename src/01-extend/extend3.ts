export type Model<TState = unknown> = TState & {
  withState<T>(state: T): Model<TState & T>;
}

export function createModel(): Model {
  // object literal is good enough as an example
  return {
    withState<TState, T>(this: Model<TState>, state: T): Model<TState & T> {
      return Object.assign(this, state);
    },
  };
}
