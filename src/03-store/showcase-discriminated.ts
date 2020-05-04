import { Xor } from './discriminated';

interface AuthRequest {
  token?: string;
  user?: string;
  password?: string;
}

// type Auth = (Omit<AuthRequest, 'token'> & { token?: undefined })
//   | (Omit<AuthRequest, 'user' | 'password'> & { user?: undefined, password?: undefined });
type Auth = Xor<Omit<AuthRequest, 'token'>, Omit<AuthRequest, 'user' | 'password'>>;

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
