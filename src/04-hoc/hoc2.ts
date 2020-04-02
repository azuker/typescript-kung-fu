// tslint:disable: max-classes-per-file
import { IsIn } from 'class-validator';

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

export class FooRequest implements QueryRequest<Foo> {
  @IsIn(['id', 'name'], { each: true })
  public sortByFields?: ('id' | 'name')[];
}

export class BarRequest implements QueryRequest<Bar> {
  // Should not compile!
  // public sortByFields?: ('id', 'else')[];

  @IsIn(['id'], { each: true })
  public sortByFields?: ('id')[];
}
