import { Xor } from './discriminated';

interface AuthRequest {
  token?: string;
  user?: string;
  password?: string;
}

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
  //   token: 'a',
  //   user: 'asdsa',
  // };
}
