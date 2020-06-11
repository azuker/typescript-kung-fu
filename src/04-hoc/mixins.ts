// tslint:disable: max-classes-per-file
// Mixins: should generally be avoided

import { log } from '../utils/log';

// Disposable Mixin
export class Disposable {
  isDisposed = false;

  dispose() {
    this.isDisposed = true;
  }
}

// Activatable Mixin
export class Activatable {
  isActive = false;
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}
