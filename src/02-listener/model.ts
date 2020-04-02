import { Observable, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';

interface FieldChange {
  value: any;
}

type FieldSet<T = any> = Record<keyof T, FieldChange>;
type ChangeSet<T = any> = Partial<FieldSet<T>>;

export class Model<T extends Record<string, any> = any> {
  private model: Partial<T> = {};
  private readonly changes = new Subject<ChangeSet<T>>();
  public readonly changes$ = this.changes.asObservable();

  withState(state: Partial<T>): Model<T> {
    this.model = Object.assign(this.model, state);

    const changeSet: ChangeSet<T> = {};
    Object.keys(state)
      .forEach(o => changeSet[o as keyof T] = { value: state[o] });
    this.changes.next(changeSet);

    return this;
  }

  getFieldChanges<TProp extends keyof T & string>(field: TProp): Observable<T[TProp]>;
  getFieldChanges<TProp extends keyof T & string>(fields: TProp[]): Observable<Partial<Pick<T, TProp>>>;
  getFieldChanges<TProp extends keyof T & string>(fields: TProp[] | TProp): Observable<T[TProp]> | Observable<Partial<Pick<T, TProp>>> {
    if (!Array.isArray(fields)) {
      return this.changes$.pipe(
        map(o => o[fields]),
        filter(o => o?.value !== undefined),
        map(o => o!.value),
      );
    }

    return this.changes$.pipe(
      filter(o => fields.some(k => o[k]?.value !== undefined)),
      map(o => o as Partial<Pick<T, TProp>>),
    );
  }
}
