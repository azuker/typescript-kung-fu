// tslint:disable: callable-types
// tslint:disable: max-classes-per-file

import { Discriminated, OneRequired, Proxy } from './misc';

// Discriminated

interface AuthRequest {
  token?: string;
  user?: string;
  password?: string;
}

// type Auth = (Omit<AuthRequest, 'token'> & { token?: undefined })
//   | (Omit<AuthRequest, 'user' | 'password'> & { user?: undefined, password?: undefined });
type Auth = Discriminated<
  Omit<AuthRequest, 'token'>,
  Omit<AuthRequest, 'user' | 'password'>
>;

export function showcase() {
  let auth: Auth = null as any;

  // ok
  auth = {
    password: 'a',
    user: 'a',
  };
  // ok
  auth = {
    token: 'a',
  };
  // not ok
  // auth = {
  //   user: 'asdsa',
  //   token: 'a',
  // };
}

// ********************************************************

// OneRequired

interface AuthOptions {
  roles?: string[];
  permissions?: string[];
}

export function authorize(options: OneRequired<AuthOptions>) {}

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
