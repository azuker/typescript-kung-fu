export type Model<T = unknown> = T & {
  withState<U>(state: U): Model<T & U>;
};

// can union as part of the function:
// export type Model<T = unknown> = {
//   withState<U>(state: U): T & U & Model<T & U>;
// };

// can use 'this' parameter:
// "extends Model" is not actually required, but it makes the implementation compatible with both Model types
// export type Model = {
//   withState<T extends Model, U>(this: T, state: U): T & U;
// };

export function createModel(): Model {
  return new ModelImpl();
};

export class ModelImpl implements Model {
  withState<T extends Model, U>(this: T, state: U): T & U {
    return Object.assign(this, state);
  }
}
