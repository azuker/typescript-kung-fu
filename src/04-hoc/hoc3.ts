// tslint:disable: max-classes-per-file
import { IsIn } from 'class-validator';

export type Type<T> = new (...args: any[]) => T;

export interface Foo {
  id: string;
  name: string;
}

export interface Bar {
  id: string;
  name: string;
}

export type QueryRequest<T> = {
  sortByFields?: (keyof T)[];
}

function QueryRequestClass<T>() {
  return <TProp extends keyof T>(...fields: TProp[]): Type<QueryRequest<Pick<T, TProp>>> => {
    class QueryRequestGen implements QueryRequest<Pick<T, TProp>> {
      @IsIn(fields, { each: true })
      public sortByFields?: TProp[];
    }
    return QueryRequestGen;
  }
}

export class FooRequest extends QueryRequestClass<Foo>()('id', 'name') { }

export class BarRequest extends QueryRequestClass<Bar>()('id') { }
