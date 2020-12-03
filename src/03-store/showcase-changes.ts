// tslint:disable: ban-types
// tslint:disable: max-classes-per-file
// tslint:disable: no-console

///////////////////////////////////////
// ng bits:

declare function Component(o: any): (target: any) => void;
declare function Input(): (target: any, key: any) => void;
declare class SimpleChange {
  previousValue: any;
  currentValue: any;
  firstChange: boolean;
  constructor(previousValue: any, currentValue: any, firstChange: boolean);
  isFirstChange(): boolean;
}
declare interface SimpleChanges {
  [propName: string]: SimpleChange;
}
declare interface OnChanges {
  ngOnChanges(changes: SimpleChanges): void;
}

@Component({})
class Demo1Component implements OnChanges {
  @Input() items = ['FR', 'DE', 'ES'];

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.items) return;
    changes.items.currentValue.forEach((o: any) => console.log(o));
  }
}

///////////////////////////////////////
// custom:

interface TypedSimpleChange<T> {
  previousValue: T;
  currentValue: T;
  firstChange: boolean;
}

type TypedSimpleChanges<T, K extends keyof T = keyof T> = SimpleChanges & {
  [P in K]?: TypedSimpleChange<T[P]>;
};

// if in a different file, can have this interface.
// same name as NG - fulfills lifecycle interface lint
// export interface OnChanges<T, K extends keyof T = keyof T> {
//   ngOnChanges(changes: TypedSimpleChanges<T, K>): void;
// }

@Component({})
class Demo2Component implements OnChanges {
  @Input() items = ['FR', 'DE', 'ES'];
  stamKey = 2;

  ngOnChanges(changes: TypedSimpleChanges<Demo2Component, 'items'>): void {
    if (!changes.items) return;
    changes.items.currentValue.forEach(o => console.log(o));
  }
}
