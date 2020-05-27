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

  getFieldChanges<TProp extends keyof T>(field: TProp): Observable<T[TProp]>;
  getFieldChanges<TProp extends keyof T>(fields: TProp[]): Observable<Partial<Pick<T, TProp>>>;
  getFieldChanges<TProp extends keyof T>(fields: TProp[] | TProp): Observable<T[TProp]> | Observable<Partial<Pick<T, TProp>>> {
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
