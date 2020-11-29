// assume you have a rich query endpoint in the backend (OData like)
// consider you want to provide a TypeScript friendly SDK

interface FilterOperations<T = unknown> {
  largerThan(p: number, options?: {inclusive?: boolean}): T;
  smallerThan(p: number): T;
  contains(p: string): T;
  startsWith(p: string, options: {trim?: boolean}): T;
}

// pick relevant functions automatically
// funcs who have parameters of the same type of the selected field

type SpreadOrSelf<T> = T extends (infer U)[] ? U : T;

type ExtractFuncsWithArgOfTypeAs<T, TArg, TOk extends string> =
  T extends (...args: infer U) => any ?
  TArg extends Extract<SpreadOrSelf<U>, TArg> ?
    TOk :
    never :
  never;

type SelectFilters<T, TArg> = {
  [P in keyof FilterOperations
    as ExtractFuncsWithArgOfTypeAs<FilterOperations[P], TArg, P>]:
      FilterOperations<T>[P];
};

interface Query2<T> {
  filter<K extends keyof T>(key: K): SelectFilters<Query2<T>, T[K]>;

  orderBy<K extends keyof T>(...keys: K[]): Query2<T>;
}

declare function createQuery2<T extends {}>(): Query2<T>;

interface Product3 {
  id: number;
  name: string;
}

const query2 = createQuery2<Product3>();

query2
  .filter('id').largerThan(2, {inclusive: false})
  .filter('name').startsWith('xbox', {trim: true})
  .orderBy('id', 'name');
