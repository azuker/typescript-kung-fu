// tslint:disable: callable-types
// tslint:disable: max-classes-per-file

import { Discriminated, AtLeastOneOf, Proxy, KeysToInterceptorUnion, InterceptFuncs, DiscriminatedMulti } from './misc';
import { log } from '../utils/log';

// Discriminated

interface AuthOption1 {
  token: string;
}
interface AuthOption2 {
  user: string;
  password: string;
}

function initiative(options: AuthOption1 | AuthOption2) {}

// should NOT compile
initiative({ user: 'asdsa', token: 'a' });

// type AuthOption =
//   (AuthOption2 & { token?: undefined }) |
//   (AuthOption1 & { user?: undefined, password?: undefined });
type AuthOption = Discriminated<AuthOption2, AuthOption1>;

export function showcase(options: AuthOption) {}

// should compile
showcase({ user: 'asdsa', password: 'a', });
showcase({ token: 'a', });

// should NOT compile
// showcase({ user: 'asdsa', token: 'a', });

// can use multi (2 or more):
// type DisAuth = DiscriminatedMulti<[AuthOption1, AuthOption2]>;
// declare const disAuth: DisAuth;

// ********************************************************

// AtLeastOneOf

interface AuthOptions {
  roles?: string[];
  permissions?: string[];
}

// problem:
// function authorize(options: AuthOptions) {}

// we want something like this:
// type AuthInput = { roles: string[] } | { permissions: string[] };
// function authorize(options: AuthInput) {
//   // But, this doesn't compile, need type guards
//   log(options.roles, options.permissions);
// }

// so, this is better:
// type AuthInput2 = {
//   roles?: string[];
//   permissions?: string[];
// } & ({ roles: string[] } | { permissions: string[] });
// function authorize(options: AuthInput2) {
//   // But, this doesn't compile, need type guards
//   log(options.roles, options.permissions);
// }

// solution:
function authorize(options: AtLeastOneOf<AuthOptions>) {}

// should NOT compile
// authorize({});

// OK
authorize({ roles: ['asdasd'] });

// ********************************************************

// as const - readonly graph

const person = {
  id: '1',
  address: {
    street: 'Oak',
    house: 15,
  },
} as const;

// should NOT compile
// person.id = '2';
// person.address.street = '2';

// ********************************************************

// Function filtering

class A {
  public name2?: string;
}
class B {
  public name?: string;
}

interface Foo {
  doA(request: A): any;
  doB(request: B): any;
}

const a = new A();
const p: Proxy<Foo> = null as any;

// OK
p.validate(A).doA(a);

// should NOT compile!
// p.validate(A).doB(a);

// ********************************************************

// Function wrapping

const wrap = <T extends unknown[], U>(fn: (...args: T) => U) => {
  return (...args: T): U => fn(...args)
}

const wrapped = wrap((p1: string, p2: number) => 2);

// ********************************************************

// Function wrapping - skip first parameter

function publishUserClickAnalytics(times: number, email: boolean, options: { alert: boolean }) {}

type SkipFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never

function publishUserClickSumAnalytics(times: number[], ...rest: SkipFirst<Parameters<typeof publishUserClickAnalytics>>) {
  // this wraps the fn above but replaces the first parameter
  // want to reuse types - all parameters except the first
  const sum = times.reduce((a, b) => a + b, 0);
  publishUserClickAnalytics(sum, ...rest);
}

// ********************************************************

// How to replace last parameter

// Index helper
type LastIndex<T extends readonly any[]> =
    ((...t: T) => void) extends ((x: any, ...r: infer R) => void) ?  Exclude<keyof T, keyof R> : never;

// Replace last parameter with mapped type
type ReplaceLastParam<TParams extends readonly any[], TReplace> = {
    [K in keyof TParams]: K extends LastIndex<TParams> ? TReplace : TParams[K] 
}

// Replace function
type ReplaceLast<F, TReplace> = F extends (...args: infer T) => infer R
    ? (...args: ReplaceLastParam<T, TReplace>) => R
    : never;

type OrigArg = { arg: number };
type ReplacedArg = { arg: string };
type OrigFunc = (a: number, b: string, c?: OrigArg) => string;
type ReplacedFunc = ReplaceLast<OrigFunc, ReplacedArg>;
// type ReplacedFunc = (a: number, b: string, c?: ReplacedArg) => string;

declare const replacedFunc: ReplacedFunc;

// ********************************************************

// Discrimination + Inferred + Reduce Type Parameter

interface BookAuthor {
  name: string;
  likes: number;
}

// Object:

const i1: KeysToInterceptorUnion<BookAuthor> = {
  key: 'likes',
  interceptor: (l => l), // l is typed as number
};

// Function:

declare const buildInterceptor: InterceptFuncs<BookAuthor>;

// i2 is typed as string
const i2 = buildInterceptor({
  key: 'name',
  interceptor: (n => n), // n is typed as string
});

// ********************************************************
