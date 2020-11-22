const translation = {
  home: {
    heading: 'Typed JavaScript at Any Scale.',
    description: 'TypeScript extends JavaScript by adding types.',
  },
  docs: {
    heading: 'TypeScript Documentation',
  },
}

type Path = SerializedPathOf<typeof translation>;

type PathOf<T extends object> = {
  [K in keyof T]: T[K] extends object ? [K, ...PathOf<T[K]>] : [K]
}[keyof T];

type SerializedPathOf<T extends object> = Join<Extract<PathOf<T>, string[]>, '.'>;

type Join<T extends string[], D extends string> =
  T extends [] ? '' :
  T extends [unknown] ? `${T[0]}` :
  T extends [unknown, ...infer U] ? `${T[0]}${D}${Join<Extract<U, string[]>, D>}` :
  string;

declare function path<T extends object>(source: T, path: PathOf<T>): string;

declare function createT<T extends object>(translation: T): (path: PathOf<T> | SerializedPathOf<T>) => string;

const t = createT(translation);

t(['home', 'heading']); // $ExpectType string
// t(['home', '💩']);      // $ExpectError

t('home.heading');     // $ExpectType string
// t('home.💩');          // $ExpectError
