// tslint:disable: max-classes-per-file

import { log } from '../utils/log';

// Example2: decorator
// can use declaration merging when you change types dynamically and TS can't pick it up

interface HasIsActive {
  isActive: boolean;
}
interface HasDisposed {
  disposed: boolean;
}

function withIsActive<T extends new(...args: any[]) => {}>(constructor: T) {
  constructor.prototype.isActive = true;
}
function withDisposed<T extends new(...args: any[]) => {}>(constructor: T) {
  constructor.prototype.disposed = false;
}

@withIsActive
@withDisposed
class SmartObject2 {}

interface SmartObject2 extends HasIsActive, HasDisposed {};

const smartObj2 = new SmartObject2();
log(smartObj2.isActive, smartObj2.disposed);
