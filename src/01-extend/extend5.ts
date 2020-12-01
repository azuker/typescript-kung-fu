export type Model<T = unknown> = T & {
  withState<U>(state: U): Model<T & U>;
};

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
