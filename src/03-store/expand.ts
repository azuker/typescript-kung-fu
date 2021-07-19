const array = [
  {
    type: 'name',
    value: 'John Doe' <
  },
  {
    type: 'age',
    value: 15,
  },
] as const;

const arrayToObject1 = <A extends ReadonlyArray<Record<string, any>>, K extends keyof A[number]>(
  array: A,
  keyField: K
) =>
  array.reduce((obj, item: A[number]) => {
    // eslint-disable-next-line no-param-reassign
    obj[item[keyField]] = item;

    return obj;
  }, {}) as {
    [P in A[number][K]]: Extract<A[number], { [I in K]: P }>;
  };

// works nice, intellisense shows the informative type:
const arrayAsKeyedObject1 = arrayToObject1(array, 'type');

// if we wanted to create a type for the return value for readability and maintainability reasons
type ArrayToKeyedObjectResult<A extends ReadonlyArray<Record<string, any>>, K extends keyof A[number]> = {
  [P in A[number][K]]: Extract<A[number], { [I in K]: P }>;
};

const arrayToObject2 = <A extends ReadonlyArray<Record<string, any>>, K extends keyof A[number]>(
  array: A,
  keyField: K
): ArrayToKeyedObjectResult<A, K> =>
  array.reduce((obj, item: A[number]) => {
    // eslint-disable-next-line no-param-reassign
    obj[item[keyField]] = item;

    return obj;
  }, {}) as ArrayToKeyedObjectResult<A, K>;

// still works, but intellisense shows the mapped type which loses valuable information:
const arrayAsKeyedObject2 = arrayToObject2(array, 'type');

// utility types to help with that:

// expands object types one level deep
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// expands object types recursively
type ExpandRecursively<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;

const arrayToObject3 = <A extends ReadonlyArray<Record<string, any>>, K extends keyof A[number]>(
  array: A,
  keyField: K
): Expand<ArrayToKeyedObjectResult<A, K>> =>
  array.reduce((obj, item: A[number]) => {
    // eslint-disable-next-line no-param-reassign
    obj[item[keyField]] = item;

    return obj;
  }, {}) as Expand<ArrayToKeyedObjectResult<A, K>>;

// works with return type as well as informative intellisense
const arrayAsKeyedObject3 = arrayToObject3(array, 'type');
