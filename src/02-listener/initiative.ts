// Make every object a smart observable object - mini stores with observables

interface Product {
  id: number;
  name: string;
}

declare function loadProductFromHttp(p: string): Promise<Product>;
declare function makeSmart(o: any): any;

async function initiative() {
  const product = await loadProductFromHttp('http://localhost/api/products/1');
  const smartProduct = makeSmart(product);

  smartProduct.observe('id').subscribe((newId: number) => { /* ... */});
  smartProduct.observe('name').subscribe((newId: string) => { /* .. .*/});
  smartProduct.observe(['id', 'name']).subscribe((newState: {}) => { /* newState.id / newState.name */});

  smartProduct.id++;
  smartProduct.name += 'suffix';
}
