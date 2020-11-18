// A utility service for sharing state across components
// Think React Context with observables

// tslint:disable: max-classes-per-file

import { Subject } from 'rxjs';
import { MaskedStore } from './store1';

// mocks
declare function Component(o: any): (target: any) => void;
declare function Inject(o: any): (p1: any, p2: any, p3: any) => void;
declare interface ContextStoreService { create<T>(o: any): any };
declare const ProductValidationStateToken: any;
declare const ContextStoreService: any;
// tslint:disable: jsdoc-format

// define state slice shape
interface ProductValidationState {
  isValid: boolean;
  errors: string[];
  saved: Subject<boolean>;
}

// parent component provides it
@Component({
  // ...
  providers: [
    {
      provide: ProductValidationStateToken,
      useFactory: ((ctx: ContextStoreService) => ctx.create<ProductValidationState>({})),
      deps: [ContextStoreService],
    },
  ],
})
class ProductEditorComponent {}

// child component gets it - the rich type

class ProductCommandsComponent {
  constructor(
    @Inject(ProductValidationStateToken) public readonly validationState: MaskedStore<ProductValidationState>,
  ) {
    // this.validationState
  }
}
