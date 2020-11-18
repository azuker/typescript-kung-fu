// Express.js

type ExtractRouteParams<T extends string> =
  string extends T
    ? Record<string, string>
    : T extends `${infer Start}:${infer Param}/${infer Rest}`
      ? {[k in Param | keyof ExtractRouteParams<Rest>]: string}
      : T extends `${infer Start}:${infer Param}`
        ? {[k in Param]: string}
        : {};

type P = ExtractRouteParams<'/posts/:postId'>;
type C = ExtractRouteParams<'/posts/:postId/:commentId/seg/:param'>;

const STR = '/posts/:postId/:commentId/seg/:param';
type D = ExtractRouteParams<typeof STR>;

// Express.js - with optional

type SplitRoute<S extends string> =
  string extends S
    ? string[] :
    S extends `${infer Start}/:${infer Param}/${infer Rest}` ? [Param, ...SplitRoute<Rest>] :
    S extends `${infer Start}/:${infer Param}` ? [Param] :
    [];

type Params<S extends string> = {
  [P in SplitRoute<S>[number] as P extends `${infer U}?` ? never : P]: string;
} & {
  [P in SplitRoute<S>[number] as P extends `${infer U}?` ? U : never]?: string;
}

type X = Params<'/users/:userId/posts/:postId?'>

let x: X;

//

type RouteParams<T extends Record<number, string>> = {
  [P in T[number]]: string;
}

type RouteSegments = ['userId', 'postId'];

declare const z: RouteParams<RouteSegments>;
// z: { userId: string; postId: string; }
