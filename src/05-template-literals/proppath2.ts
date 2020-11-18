/*
 * T: { foo: { bar: string }, baz: { bam: string }, moo: string }

  foo extends object --> ['foo'] | ?
    ? --> bar NOT extends object --> ['foo', 'bar']
    --> foo: ['foo', ['foo', 'bar']]
  baz extends object --> ['baz'] | ?
    ? --> bam NOT extends object --> ['baz', 'bam']
    --> baz: ['baz'] | ['baz', 'bam']
  moo NOT extends object --> ['moo']
    --> moo: ['moo']

  --> { foo: ['foo'] | ['foo', 'bar'], baz: ['baz'] | ['baz', 'bam'], moo: ['moo'] }

  -[keyof T]-> ['foo'] | ['foo', 'bar'] | ['baz'] | ['baz', 'bam'] | ['moo']
 */

type PathOf2<T extends object, P extends any[] = []> = {
  [K in keyof T]:
    T[K] extends object ? ([...P, K] | PathOf2<T[K], [...P, K]>) :
    [...P, K]
}[keyof T];

type Join2<T extends string[], D extends string> =
    T extends string ? T :
    T extends [] ? '' :
    T extends [unknown] ? `${T[0]}` :
    T extends [unknown, ...infer U] ?
    `${T[0]}${D}${Join2<U, D>}` :
    string;

/*
 * T: { foo: { bar: string }, baz: { bam: string }, moo: string }
  PathOf2<T>: 'foo' | ['foo', 'bar'] | ['baz'] | ['baz', 'bam'] | ['moo']

  Extract all string array keys, each join items with '.' delimiter
  --> 'foo' | 'baz' | 'moo' | 'foo.bar' | 'baz.bam'

  Voila! those are the possible values!
 */
type SerializedPathOf2<T extends object> = Join2<Extract<PathOf2<T>, string[]>, '.'>;

/*
 * O: { foo: { bar: string }, baz: { bam: string }, moo: string }
  T: 'foo.bar'

  Resolve the value of the key path

  'foo.bar' extends `$Start.$Rest` -->
    O: { bar: string }
    T: 'bar'
      'bar' NOT extends `$Start.$Rest`
      --> 'bar' extends `$Start`
        --> O['bar']
        --> string
 */
type ExtractKeyPath2<O extends Record<string, any>, T extends string> =
  string extends T
    ? unknown
    : T extends `${infer Start}.${infer Rest}`
      ? ExtractKeyPath2<O[Start], Rest>
      : T extends `${infer Start}`
        ? O[Start]
        : unknown;

declare function get2<O extends {}, T extends SerializedPathOf2<O>>(o: O, path: T): ExtractKeyPath2<O, T>;

type Person2 = { address: { street: string, num: number, foo: { bar: string } }};

declare const pp: Person2;

const pp1 = get2(pp, 'address'); // { street: string; num: number; foo: { bar: string; } }
const pp2 = get2(pp, 'address.street'); // string
const pp3 = get2(pp, 'address.num'); // number
const pp4 = get2(pp, 'address.foo'); // { bar: string }
const pp5 = get2(pp, 'address.foo.bar'); // number
// const pp6 = get2(pp, 'address2.street'); // error!
