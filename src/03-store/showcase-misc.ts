// tslint:disable: callable-types
// tslint:disable: max-classes-per-file

import { Discriminated, AtLeastOneOf, Proxy } from './misc';

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

// ********************************************************

// OneRequired

interface AuthOptions {
  roles?: string[];
  permissions?: string[];
}

export function authorize(options: AtLeastOneOf<AuthOptions>) {}

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
