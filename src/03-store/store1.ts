// tslint:disable: array-type
import { Observable, Subject } from 'rxjs';

/*
  - Shape1 has the same keys of Shape2
  - Values of Shape1's keys are either never or the key name
  - Shape1[keyof Shape2] - like T[P] but values of all keys combined with "|"

  type Foo = { id: number; name: string; birth: Date; };
  // exclude number:
  type F = {
    id: never;
    name: 'name';
    birth: 'birth';
  };
  type F2 = F[keyof Foo];
  // F2 = 'name' | 'birth'
*/

export type ExcludeKeysOfType<T, U> = { [P in keyof T]: T[P] extends U ? never : P }[keyof T];
export type ExtractKeysOfType<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T];

export type OmitPropsOfType<T, K> = {
  [P in ExcludeKeysOfType<T, K>]: T[P];
};
export type PickPropsOfType<T, K> = {
  [P in ExtractKeysOfType<T, K>]: T[P];
};

// TS4.1:
// type PickOfType<T extends {}, K> = {
//   [P in keyof T as T[P] extends K ? P : never]: T[P];
// };
// type OmitOfType<T extends {}, K> = {
//   [P in keyof T as T[P] extends K ? never : P]: T[P];
// };

export type OmitSubjectProps<T> = OmitPropsOfType<T, Subject<any>>;
export type ExtractSubjectProps<T> = PickPropsOfType<T, Subject<any>>;

export type TransformPropsToObservables<T> = {
  readonly [P in keyof T]: Observable<T[P]>;
};

export type TransformPropsToFuncOrProp<T> = {
  readonly [P in keyof T]: T[P] | (() => T[P]);
};

export type TransformSubjectPropsToObservables<T> = {
  readonly [P in ExtractKeysOfType<T, Subject<any>>]:
    T[P] extends Subject<infer U> ? Observable<U> : T[P];
};

export type MaskedStore<T> = OmitSubjectProps<T> & {
  __subjects: ExtractSubjectProps<T>,
  streams: TransformSubjectPropsToObservables<T>,
  $: TransformPropsToObservables<T> & ((currentValueIncluded: boolean) => TransformPropsToObservables<T>),
};

type ReadonlyAsIs = Date;
export type ReadonlyGraph<T extends {}> = {
  readonly [P in keyof T]:
    T[P] extends ReadonlyAsIs ? T[P] :
    T[P] extends (...args: infer U1) => infer U2 ? (...args: ReadonlyGraph<U1>) => ReadonlyGraph<U2> :
    T[P] extends Array<infer U3> ? ReadonlyArray<ReadonlyGraph<U3>> :
    T[P] extends Set<infer U4> ? ReadonlySet<ReadonlyGraph<U4>> :
    T[P] extends Map<infer U5, infer U6> ? ReadonlyMap<ReadonlyGraph<U5>, ReadonlyGraph<U6>> :
    T[P] extends {} ? ReadonlyGraph<T[P]> :
    Readonly<T[P]>;
};
