// Make every object a smart observable object - mini stores with observables

interface Product {
  id: number;
  name: string;
  price: number;
}

declare function loadProductFromHttp(p: string): Promise<Product>;
declare function makeSmart(o: any): any;

async function initiative() {
  const product = await loadProductFromHttp('http://localhost/api/products/1');
  const smartProduct = makeSmart(product);

  smartProduct.observe('id').subscribe((newId: number) => { });
  smartProduct.observe('name').subscribe((newId: string) => { });
  smartProduct.observe(['id', 'name'])
    .subscribe((newState: {id?: number; name?: string;}) => { });

  smartProduct.id++;
  smartProduct.name += 'suffix';
}
