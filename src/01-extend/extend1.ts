export interface Model {
  withState(state: any): Model
}

export function createModel(): Model {
  // object literal is good enough as an example
  return {
    withState(this: Model, state: any) {
      return Object.assign(this, state);
    },
  };
}
