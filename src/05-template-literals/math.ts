// based on: https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f

// Utility types
type Length<T extends any[]> = T extends { length: infer L } ? L : never;

type BuildTuple<L extends number, T extends any[] = []> = T extends { length: L }
  ? T
  : BuildTuple<L, [...T, any]>;

type MultiAdd<N extends number, A extends number, I extends number> = I extends 0
  ? A
  : MultiAdd<N, Add<N, A>, Subtract<I, 1>>;

type AtTerminus<A extends number, B extends number> = A extends 0
  ? true
  : (B extends 0 ? true : false);

type EQ<A, B> = A extends B
  ? (B extends A ? true : false)
  : false;

type LT<A extends number, B extends number> = AtTerminus<A, B> extends true
  ? EQ<A, B> extends true
    ? false
    : (A extends 0 ? true : false)
  : LT<Subtract<A, 1>, Subtract<B, 1>>;

type MultiSub<N extends number, D extends number, Q extends number> = LT<N, D> extends true
  ? Q
  : MultiSub<Subtract<N, D>, D, Add<Q, 1>>;

type IsPositive<N extends number> = `${N}` extends `-${number}`
  ? false
  : true;

type IsWhole<N extends number> = `${N}` extends `${number}.${number}`
  ? false
  : true;

type IsValid<N extends number> = IsPositive<N> extends true
  ? (IsWhole<N> extends true ? true : false)
  : false;

type AreValid<A extends number, B extends number> = IsValid<A> extends true
  ? (IsValid<B> extends true ? true : false)
  : false;

// Arithmetical types
type Add<A extends number, B extends number> = Length<[...BuildTuple<A>, ...BuildTuple<B>]>;

type Subtract<A extends number, B extends number> = BuildTuple<A> extends [...(infer U), ...BuildTuple<B>]
  ? Length<U>
  : never;

type Multiply<A extends number, B extends number> = MultiAdd<A, 0, B>;

type Divide<A extends number, B extends number> = MultiSub<A, B, 0>;

type Modulo<A extends number, B extends number> = LT<A, B> extends true
  ? A
  : Modulo<Subtract<A, B>, B>;

// Safeguarded arithmetical types
type SafeAdd<A extends number, B extends number> = AreValid<A, B> extends true
  ? Add<A, B>
  : never;

type SafeSubtract<A extends number, B extends number> = AreValid<A, B> extends true
  ? Subtract<A, B>
  : never;

type SafeMultiply<A extends number, B extends number> = AreValid<A, B> extends true
  ? Multiply<A, B>
  : never;

type SafeDivide<A extends number, B extends number> = AreValid<A, B> extends true
  ? Divide<A, B>
  : never;

type SafeModulo<A extends number, B extends number> = AreValid<A, B> extends true
  ? Modulo<A, B>
  : never;

declare const v1: Divide<8, 4>; // `2`
declare const v2: SafeModulo<9, 4>; // `1`

type DecimalDivideRem<T1 extends number, T2 extends number> = SafeModulo<T1, T2> extends 0 // @ts-ignore
  ? `${SafeDivide<T1, T2>}rem`
  : `${SafeDivide<T1, T2>}.${SafeModulo<T1, T2>}rem`;

const BASE_FONT_SIZE = 16;
type BASE_SIZE_TYPE = typeof BASE_FONT_SIZE;

declare function remRatio<T extends number>(fontSize: T): DecimalDivideRem<T, BASE_SIZE_TYPE>;

const size = remRatio(35); // size: '2.3rem'
