type CamelizeString<T extends PropertyKey> =
  T extends string ? string extends T ? string :
  T extends `${infer F}_${infer R}` ? `${F}${Capitalize<CamelizeString<R>>}` : T : T;

type Camelize<T> = {
  [K in keyof T as CamelizeString<K>]: T[K]
}

type CharSelfOrSnaked<T extends string> =
  string extends T ? T :
  T extends `${Uppercase<T>}` ? T extends `${Lowercase<T>}` ? T : `_${Lowercase<T>}` : T;

type SnakeizeString<T extends PropertyKey> =
    T extends string
      ? string extends T
        ? T
        : T extends `${infer First}${infer Rest}`
          ? `${CharSelfOrSnaked<First>}${SnakeizeString<Rest>}`
          : T
      : T;

type Snakeize<T extends {}> = {
  [P in keyof T as SnakeizeString<P>]: T[P];
}

// showcase:

type CamelizeExample = Camelize<{ first_name: string; some_other_id: number; }>;
// { firstName: string; someOtherId: number; }

type SnakeizeExample = Snakeize<{ firstName: string; someOtherId: number; }>;
// { first_name: string; some_other_id: number; }
