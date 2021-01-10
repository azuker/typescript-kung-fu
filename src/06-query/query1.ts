// assume you have a rich query endpoint in the backend (OData like)
// consider you want to provide a TypeScript friendly SDK

// get products with id lower than 2 and name contains lala:
// localhost:8080/api/products?filter=id#lt#2$and$name#contains#lala

interface NumberFilters<T> {
  largerThan(p: number): NumberFilters<T> & T;
  smallerThan(p: number): NumberFilters<T> & T;
}

interface StringFilters<T> {
  contains(p: string): StringFilters<T> & T;
  startsWith(p: string): StringFilters<T> & T;
}

interface Query<T> {
  filter<K extends keyof T>(key: K):
    T[K] extends number ? NumberFilters<Query<T>> :
    T[K] extends string ? StringFilters<Query<T>> :
    void;

  orderBy<K extends keyof T>(...keys: K[]): Query<T>;
}

declare function createQuery<T extends {}>(): Query<T>;

interface Product2 {
  id: number;
  name: string;
}

const query = createQuery<Product2>();

query
  .filter('id').largerThan(2)
  .filter('name').contains('xbox')
  .orderBy('id', 'name');
