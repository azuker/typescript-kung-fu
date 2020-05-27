import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { log } from '../utils/log';

// import { Model } from './listener1';
// import { Model } from './listener2';
import { Model } from './listener3';

interface Foo {
  id: number;
  name: string;
  birth: Date;
}

export function showcaseListener() {
  const cleanup = new Subject();
  const model = new Model<Foo>();

  model.getFieldChanges('id').pipe(
    map(o => o.toFixed()),
    takeUntil(cleanup),
  ).subscribe(log);

  model.getFieldChanges('name').pipe(
    map(o => o.substring(0)),
    takeUntil(cleanup),
  ).subscribe(log);

  model.getFieldChanges(['id', 'name']).pipe(
    map(o => {
      o.id?.toFixed();
      o.name?.substring(0);
      // should NOT compile!
      // o.birth?.getDate();
      return o;
    }),
    takeUntil(cleanup),
  ).subscribe(log);

  log('id, name, birth:');
  model.withState({ id: 2, name: 'Model 2', birth: new Date() });

  log('id:');
  model.withState({ id: 2 });

  log('birth:');
  model.withState({ birth: new Date() });

  cleanup.next();
  cleanup.complete();
}
