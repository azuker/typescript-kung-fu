export interface Model {
  withState(state: any): Model;
}

export function createModel(): Model {
  // object literal is good enough as an example
  return {
    withState(state: any) {
      return Object.assign(this, state);
    },
  };
}

// declare const p: Model;
// const p1 = p
//   .withState({id: 2})
//   // .withState({ name: 'john '})
//   ;