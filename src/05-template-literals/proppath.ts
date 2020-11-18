type ExtractKeyPath<O extends Record<string, any>, T extends string> =
  string extends T
    ? unknown
    : T extends `${infer Start}.${infer Rest}`
      ? ExtractKeyPath<O[Start], Rest>
      : T extends `${infer Start}`
        ? O[Start]
        : unknown;

declare function get<O, T extends string>(o: O, path: T): ExtractKeyPath<O, T>;

type Person = { address: { street: string, num: number }};
declare const p: Person;

const p1 = get(p, 'address'); // { street: string; num: number }
const p2 = get(p, 'address.street'); // string
const p3 = get(p, 'address.num'); // number
