import { log } from '../utils/log';
import { createModel } from './extend1';
// import { createModel } from './extend2';
// import { createModel } from './extend3';
// import { createModel } from './extend4';

export function showcaseExtend() {
  // Model - withState<T extends Model, U>(this: T, state: U): T & U

  const model = createModel() // Model
    .withState({ name: 'Jane' }) // Model & { name: string }
    .withState({ id: 2 }); // Model & { name: string } & { id: number }

  log((model as any).name);

  // SHOULD compile:
  // log(model.name);
  // log(model.id);

  // SHOULD NOT compile:
  // log(model.else);
}
