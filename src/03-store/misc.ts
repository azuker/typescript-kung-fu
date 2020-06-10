// tslint:disable: max-classes-per-file
// tslint:disable: callable-types

// Discriminated

// remove keys of U from T and have the remaining ones as never (undefined)
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

// return discriminated union:
// LEFT: T without U-keys as never & U: U-keys the same + T-keys as never
// RIGHT: U without T-keys as never & T: T-keys the same + U-keys as never
// LEFT | RIGHT: keys that don't exist in both can't be set together
export type Discriminated<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

// **************************************************

// One Required

// like partial but exclude empty
type WrapTypeKeys<T> = {[K in keyof T]: Pick<Required<T>, K> };
export type OneRequired<T, U = WrapTypeKeys<T>> = Partial<T> & U[keyof U];

/*
interface AuthOptions {
  roles?: string[];
  permissions?: string[];
}

U: interface AuthOptionsWrapper {
  roles: { roles: string[] };
  permissions: { permissions: string[] };
}

U[keyof U]:
  { roles: string[] } | { permissions: string[] }
*/

// **************************************************

// Function filtering

interface Type<T> extends Function {
  new (...args: any[]): T;
}
type ExtractKeysOfType<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T];
type ExtractFuncs<T, U> = {
  [P in ExtractKeysOfType<T, (args: U) => any>]: T[P];
}

export interface Proxy<T> {
  validate<U>(payloadType: Type<U>): ExtractFuncs<T, U>;
}

// ********************************************************
