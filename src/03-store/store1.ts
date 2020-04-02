// tslint:disable: array-type
import { Observable, Subject, defer, concat, empty, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/*
  - Shape1 has the same keys of Shape2
  - Values of Shape1's keys are either never or the key name
  - Shape1[keyof Shape2] - like T[P] but values of all keys

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

export type OmitKeysOfType<T, U> = { [P in keyof T]: T[P] extends U ? never : P }[keyof T];
export type ExtractKeysOfType<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T];

export type OmitPropsOfType<T, K> = {
  [P in OmitKeysOfType<T, K>]: T[P];
};
export type ExtractPropsOfType<T, K> = {
  [P in ExtractKeysOfType<T, K>]: T[P];
};

export type OmitSubjectProps<T> = OmitPropsOfType<T, Subject<any>>;
export type ExtractSubjectProps<T> = ExtractPropsOfType<T, Subject<any>>;

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

export type MaskedStore<T> = OmitSubjectProps<T> & {
  streams: TransformSubjectPropsToObservables<T>,
  subjects: ExtractSubjectProps<T>,
  unmasked: ContextStoreService,
  setFrom: (value: Partial<T>) => void,
  setDefaults: (value: Partial<TransformPropsToFuncOrProp<T>>) => void,
  $: TransformPropsToObservables<T>,
};

export class ContextStoreService {
  private readonly store: Record<string, any> = {};
  private readonly hasParent: boolean;
  private readonly changes = new Subject<{key: string, value: any}>();
  private readonly proxies: {[k: string]: any} = {};
  private readonly keyChangeStreams: {[k: string]: Observable<any>} = {};

  constructor(
    private readonly parentContext?: ContextStoreService,
  ) {
    this.hasParent = !!parentContext;
  }

  ngOnDestroy() {
    this.changes.complete();
    this.changes.unsubscribe();
  }

  maskAs<T>(): MaskedStore<T> {
    return this.maskScopeAs<T>(k => k);
  }

  isolateAs<T>(key: string): MaskedStore<T> {
    return this.maskScopeAs<T>(k => `__${key}${k}`);
  }

  private maskScopeAs<T>(formatKey: (key: string) => string): MaskedStore<T> {
    const prefix = formatKey('');
    let proxy = this.proxies[prefix];

    if (!proxy) {
      const changesHandler = {
        get: (obj: ContextStoreService, prop: string) =>
          obj.keyChangeStream(formatKey(prop)),
      };
      const changesProxy = new Proxy(this, changesHandler);

      const subjectsHandler = {
        get: (obj: ContextStoreService, prop: string) =>
          obj.get(formatKey(prop)),
        set: (obj: ContextStoreService, prop: string, value: any) => {
          obj.set(formatKey(prop), value);
          return true;
        },
      };
      const subjectsProxy = new Proxy(this, subjectsHandler);

      const streamsHandler = {
        get: (obj: ContextStoreService, prop: string) =>
          obj.getCachedObservable(formatKey(prop)),
        set: () => {
          throw new Error('Can not set a readonly observable stream');
        },
      };
      const streamsProxy = new Proxy(this, streamsHandler);

      const handler = {
        get: (obj: ContextStoreService, prop: string) => {
          const knownProp = prop as keyof MaskedStore<T>;
          switch (knownProp) {
            case '$':
              return changesProxy;
            case 'unmasked':
              return obj;
            case 'streams':
              return streamsProxy;
            case 'subjects':
              return subjectsProxy;
            case 'setFrom':
              return (v: Partial<T>) => obj.setFrom(v, prefix);
            case 'setDefaults':
              return (v: Partial<TransformPropsToFuncOrProp<T>>) => obj.setDefaults(v, prefix);
            default:
              return obj.get(formatKey(prop));
          }
        },
        set: (obj: ContextStoreService, prop: string, value: any) => {
          obj.set(formatKey(prop), value);
          return true;
        },
      };

      proxy = new Proxy(this, handler);
      this.proxies[prefix] = proxy;
    }

    return proxy as MaskedStore<T>;
  }

  private ownsKey(key: string): boolean {
    return this.store.hasOwnProperty(key);
  }

  private chainOwnsKey(key: string): boolean {
    return this.ownsKey(key) || this.hasParent && this.parentContext!.chainOwnsKey(key);
  }

  private observableKey(key: string) {
    return `${key}__observable`;
  }

  private getCachedObservable<T>(key: string): Observable<T> | undefined {
    const projectedKey = this.observableKey(key);
    const projection = (o: Subject<T>) => o.asObservable();

    return this.getAndProject<Subject<T>, Observable<T>>(key, projectedKey, projection);
  }

  get<T>(key: string): T | undefined {
    return this.ownsKey(key) || !this.hasParent
      ? this.getSelf<T>(key)
      : this.parentContext!.get(key);
  }

  private getAndProject<T, K>(key: string, projectedKey: string,
    projection: (value: T) => K): K | undefined {
    if (this.ownsKey(key) || !this.hasParent) {
      let projected = this.getSelf<K>(projectedKey);
      if (projected) return projected;

      const value = this.getSelf<T>(key);
      if (!value) return undefined;

      projected = projection(value);
      this.setSelf(projectedKey, projected);
      return projected;
    }

    return this.parentContext!.getAndProject(key, projectedKey, projection);
  }

  private getSelf<T>(key: string): T | undefined {
    return this.store[key] as T;
  }

  setFrom(value: any, prefix = '') {
    Object.keys(value).forEach(k => {
      const key = `${prefix}${k}`;
      this.set(key, value[k]);
    });
  }

  set(key: string, value: any) {
    if (!this.setInChain(key, value)) {
      this.setSelf(key, value);
    }
  }

  setDefault(key: string, value: any | (() => any)) {
    if (!this.chainOwnsKey(key)) {
      const v = typeof value === 'function' ? value() : value;
      this.setSelf(key, v);
    }
  }

  setDefaults(value: {[P: string]: any | (() => any)}, prefix = '') {
    const formatKey = (k: string) => `${prefix}${k}`;
    Object.keys(value).forEach(k => this.setDefault(formatKey(k), value[k]));
  }

  private setInChain(key: string, value: any): boolean | undefined {
    if (this.ownsKey(key)) {
      this.setSelf(key, value);
      return true;
    }

    return this.hasParent ? this.parentContext!.setInChain(key, value) : undefined;
  }

  private setSelf(key: string, value: any): void {
    this.store[key] = value;
    const projectedKey = this.observableKey(key);
    this.store[projectedKey] = undefined;
    this.changes.next({key, value});
  }

  keyChangeStream<T>(key: string): Observable<T> {
    return this.keyChangeStreamInChain(key) || this.keyChangeSelfStream<T>(key);
  }

  private keyChangeStreamInChain<T>(key: string): Observable<T> | undefined {
    return this.ownsKey(key)
      ? this.keyChangeSelfStream<T>(key)
      : this.hasParent ? this.parentContext!.keyChangeStreamInChain(key) : undefined;
  }

  private keyChangeSelfStream<T>(key: string, includeCurrentValue = true): Observable<T> {
    let stream = this.keyChangeStreams[key];
    if (stream) return stream;

    stream = concat(
      defer(() => {
        if (!includeCurrentValue) return empty();
        const value = this.getSelf<T>(key);
        return (value === undefined)
          ? empty()
          : of(value);
      }),
      this.changes.pipe(
        filter(o => o.key === key),
        map(o => o.value),
      ),
    );

    this.keyChangeStreams[key] = stream;
    return stream;
  }
}
