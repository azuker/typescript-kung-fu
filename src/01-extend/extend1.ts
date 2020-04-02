export interface Model {
  withState(state: any): Model
}

export function createModel(): Model {
  // object literal is good enough as an example
  const model = {} as Model;
  model.withState = (state: any) => Object.assign(model, state);

  return model;
}
