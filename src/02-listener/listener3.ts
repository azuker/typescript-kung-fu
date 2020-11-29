import { Observable, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export class Model<T extends Record<string, any> = any> {
  private model: Partial<T> = {};
  private readonly changes = new Subject<Partial<T>>();
  public readonly changes$ = this.changes.asObservable();

  withState(state: Partial<T>): Model<T> {
    this.model = Object.assign(this.model, state);
    this.changes.next(state);

    return this;
  }

  observe<TProp extends keyof T>(field: TProp): Observable<T[TProp]>;
  observe<TProp extends keyof T>(fields: TProp[]): Observable<Partial<Pick<T, TProp>>>;
  observe<TProp extends keyof T>(fields: TProp[] | TProp): Observable<T[TProp]> | Observable<Partial<Pick<T, TProp>>> {
    if (!Array.isArray(fields)) {
      return this.changes$.pipe(
        map(o => o[fields] as T[TProp]),
        filter(o => o !== undefined),
      );
    }

    return this.changes$.pipe(
      filter(o => fields.some(k => o[k] !== undefined)),
    );
  }
}

/*

keyof T - all keys of T

type Foo = { id: number; name: string; age: number; };
keyof Foo --> 'id' | 'name' | 'age'

T[K] - type of K's key in T
Foo['id'] --> number

*********

Pick<T, U> - picks U keys from T

Pick<{ id: number; name: string; age: number; }, 'id | name'>
  --> { id: number; name: string; }

*********

Partial<T> - all keys as T but as optional

Partial<{ id: number; name: string; age: number; }>
  --> { id?: number; name?: string; age?: number; }

*/