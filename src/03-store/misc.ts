// tslint:disable: max-classes-per-file
// tslint:disable: callable-types

// Discriminated

// keys that exist in T and not in U as never, results in undefined
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

// return discriminated union:
// LEFT: T without U-keys as never & U: U-keys the same + T-keys as never
// RIGHT: U without T-keys as never & T: T-keys the same + U-keys as never
// LEFT | RIGHT: keys that don't exist in both can't be set together
export type Discriminated<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type DiscriminatedMulti<T extends readonly any[]> = 
  T extends [infer U1, ...infer U]
    ? U extends [infer U2, ...infer Rest]
      ? Discriminated<U1, DiscriminatedMulti<U>>
      : U1
    : never;

// **************************************************

// AtLeastOneOf

// like partial but exclude empty
type WrapTypeKeys<T> = { [K in keyof T]: Pick<Required<T>, K> };
export type AtLeastOneOf<T, U = WrapTypeKeys<T>> = Partial<T> & U[keyof U];

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

// Discrimination + Inferred + Reduce Type Parameter

// Object:

interface KeyInterceptor<T, K extends keyof T> {
  key: K;
  interceptor?: (visitor: T[K]) => T[K];
}

export type KeysToInterceptorUnion<T> = {
  [K in keyof T]: KeyInterceptor<T, K>;
}[keyof T];

// the idea: KeyInterceptor<User, 'name'> | KeyInterceptor<User, 'birth'>

// Function:
// (note: if it wasn't for the return type it could have been simpler like the sample above)

// thanks to distributive conditional types and inference
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type InterceptFunc<T, K extends keyof T> = (options: KeyInterceptor<T, K>) => T[K];
type KeysToInterceptFuncUnion<T> = {
  [K in keyof T]: InterceptFunc<T, K>;
}[keyof T];

export type InterceptFuncs<T> = UnionToIntersection<KeysToInterceptFuncUnion<T>>;

// the idea: InterceptFunc<User, 'name'> & InterceptFunc<User, 'birth'>

// ********************************************************

// WidenLiteral - if we want to widen a literal/specific type to its primitive type (opposite of `as const`)

export type WidenLiteral<T> = T extends string | number | boolean | bigint | symbol ? ReturnType<T["valueOf"]> : never;

// ********************************************************
