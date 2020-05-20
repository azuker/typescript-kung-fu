import { Discriminated, OneRequired } from './misc';

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
