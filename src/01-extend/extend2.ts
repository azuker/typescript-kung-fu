// making it work with a class + this type

export function createModel(): Model {
  return new Model();
}

export class Model {
  withState<T, U>(this: T, state: U): T & U {
    return Object.assign(this, state);
  }
}
