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

export class FooRequest {
  @IsIn(['id', 'name'], { each: true })
  public sortByFields?: ('id' | 'name')[];
}

export class BarRequest {
  @IsIn(['id'], { each: true })
  public sortByFields?: ('id')[];
}
