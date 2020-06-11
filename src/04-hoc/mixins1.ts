// tslint:disable: max-classes-per-file

import { Disposable, Activatable } from './mixins';

// Example1: apply mixin via separate function (official docs)

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      Object.defineProperty(derivedCtor.prototype, name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!);
    });
  });
}

class SmartObject {}

applyMixins(SmartObject, [Disposable, Activatable]);

// however, this doesn't compile:

const smartObj1 = new SmartObject();
setTimeout(() => smartObj1.activate(), 1000);

// fix - declaration merging:
interface SmartObject extends Disposable, Activatable { }
