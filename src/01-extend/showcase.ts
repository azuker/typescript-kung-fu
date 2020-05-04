import { log } from '../utils/log';
import { createModel } from './extend1';
// import { createModel } from './extend2';

export function showcaseExtend() {
  const model = createModel()
    .withState({ name: 'Jane' });

  log((model as any).name);
  // SHOULD compile:
  // log(model.name);
}
