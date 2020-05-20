// ////////////////////////////////////

// Generics!
// write code that works with a type parameter - not any
// untyped in a typed way
// can have multiple type parameters and enforce contraints

import { log } from './utils/log';

function addTotal<T extends {total: number}>(o: T, v: number): T {
  o.total += v;
  return o;
}

const newTotal = addTotal({total: 1}, 1).total;
log(newTotal);

// ////////////////////////////////////

// Mapped Types & Condition Types
// project types off existing types

type Person = {id: string; name: string;};
type Animal = {name: string; color: string};

// can get keys of person
type PersonKeys = keyof Person;

type SillyMappedType = {
  [P in PersonKeys]: Person[P];
}
type PersonWithoutId = {
  [P in Exclude<PersonKeys, 'id'>]: Person[P];
}

type PersonOrAnimal<T> = T extends Person
  ? Person
  : T extends Animal ? Animal : T;

const person: PersonOrAnimal<{name: string; id: string; age: number;}> = null as any;
const animal: PersonOrAnimal<{name: string; color: string; age: number;}> = null as any;

// ////////////////////////////////////

// typeof
// not just a guard, can create type from variables

const p = {
  id: '1',
  name: '2',
};

type Person2 = typeof p;
type Person2Keys = keyof Person2;

// ////////////////////////////////////

// Discriminated Unions
// combine types and discriminate according to a "singleton" property

interface Square {
  kind: 'square';
  size: number;
}
interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Square | Rectangle;

// OK
const shape1: Shape = {
  kind: 'square',
  size: 2,
};

// NOT OK
// const shape2: Shape = {
//   kind: 'rectangle',
//   size: 2,
// };

// ////////////////////////////////////
