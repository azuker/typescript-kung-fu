// tslint:disable: max-classes-per-file

import { Disposable, Activatable } from './mixins';

// Example3: mixin as extend hoc

type Constructor<T> = new(...args: any[]) => T

function mixin<T1, T2>(ctor1: Constructor<T1>, ctor2: Constructor<T2>): Constructor<T1 & T2>;
function mixin<T1, T2, T3>(ctor1: Constructor<T1>, ctor2: Constructor<T2>, ctor3: Constructor<T3>): Constructor<T1 & T2 & T3>;
function mixin(...baseCtors: any[]): any {
  class Class {};
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(Class.prototype, name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!);
    });
  });
  return Class;
}

class SmartObject extends mixin(Disposable, Activatable) {}

const smartObj1 = new SmartObject();
setTimeout(() => smartObj1.activate(), 1000);
