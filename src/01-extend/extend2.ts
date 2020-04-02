export interface Model {
  withState<T>(state: T): Model & T;
}

export function createModel(): Model {
  // object literal is good enough as an example
  const model = {} as Model;
  model.withState = <T>(state: T) => Object.assign(model, state);

  return model;
}
