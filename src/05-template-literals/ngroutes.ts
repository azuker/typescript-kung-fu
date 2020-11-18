type Route = { path: string, children?: Route[] };
type ParamValue = string | number | boolean | bigint;
type Split<S extends string, D extends string> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];
type ParsePathPart<PathPart extends string> =  PathPart extends `:${infer R}` ? ParamValue : PathPart;
type ParseParams<PathParts> =
  PathParts extends []
    ? []
    : PathParts extends [string]
      ? [ParsePathPart<PathParts[0]>]
      : PathParts extends [string, ...infer U]
        ? [ParsePathPart<PathParts[0]>, ...ParseParams<U>]
        : [];
type ParsePath<PathString extends string> = PathString extends '' ? [] : ParseParams<Split<PathString, '/'>>;
type RoutePath<CurrentRoute, Prefix extends ParamValue[]> =
  CurrentRoute extends { path: infer PathString }
    ? PathString extends string
      ? [...Prefix, ...ParsePath<PathString>]
      : []
    : [];
type PathWithChildren<CurrentRoute extends Route, Prefix extends ParamValue[]> = [
  RoutePath<CurrentRoute, Prefix>,
  ...RoutesToPaths<CurrentRoute['children'], RoutePath<CurrentRoute, Prefix>>,
];
type RoutesToPaths<Routes, Prefix extends ParamValue[] = []> =
  Routes extends []
    ? []
    : Routes extends [Route]
      ? [...PathWithChildren<Routes[0], Prefix>]
      : Routes extends [Route, ...infer RemainingRoutes]
        ? [...PathWithChildren<Routes[0], Prefix>, ...RoutesToPaths<RemainingRoutes, Prefix>]
        : [];
type Unwrap<V> = V extends [] ? never : V extends [infer U] ? U : V extends [infer U, ...infer W] ? U | Unwrap<W> : never;
type Filter<V> = V extends [...any] ? V : never;

function routes<T extends Route[]>(...routes: T): T {
  return routes;
}
function createPathBuilder<V extends Route[]>(routes: V): (...args: Filter<Unwrap<RoutesToPaths<V>>>) => string {
  return () => '' as any;
}

/**
 * Example
 */
const appRoutes = routes(
  {
    path: '' as const,
  },
  {
    path: 'book/:id' as const,
    children: routes(
      {
        path: 'author/:id' as const,
      },
    ),
  },
)

const buildPath = createPathBuilder(appRoutes)

buildPath() // => ''
buildPath('book', 12) // => 'book/12'
buildPath('book', '123', 'author', 976) // => 'book/123/author/976'
// error:
// buildPath('fake', 'route') // => throw Error('Unknown route')
// buildPath('book', null) // => (strict mode) throw Error('null is an invalid value')
