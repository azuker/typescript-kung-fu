// remove keys of U from T and have the remaining ones as never (undefined)
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

// return discriminated union:
// LEFT: T without U-keys as never & U: U-keys the same + T-keys as never
// RIGHT: U without T-keys as never & T: T-keys the same + U-keys as never
// LEFT | RIGHT: keys that don't exist in both can't be set together
export type Xor<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;
