// making it work with a simple object + generic model

export type Model<T = unknown> = T & {
  withState<U>(state: U): Model<T & U>;
}

export function createModel(): Model {
  return {
    withState<T, U>(this: Model<T>, state: U): Model<T & U> {
      return Object.assign(this, state);
    },
  };
}
