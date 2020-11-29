// making it work with a simple object + this type

export type Model = {
  withState<T extends Model, U>(this: T, state: U): T & U;
}

export function createModel(): Model {
  return {
    withState<T extends Model, U>(this: T, state: U): T & U {
      return Object.assign(this, state);
    },
  };
}
