import { log } from '../utils/log';

// 1.
// function genId<T>(obj: T): T & {id: string} {
//   // does not compile
//   obj.id = 'truly-random';
//   return obj;
// }

// 2.
// function genId<T extends {id?: any}>(obj: T): T & {id: string} {
//   // TS issue: object with only optionals doesn't accept objects without at least one
//   obj.id = 'truly-random';
//   return obj as T & {id: string};

//   // OR..
//   // const source = obj as T & {id: string};
//   // source.id = 'truly-random';
//   // return source;
// }

// const person = {
//   name: 'Jane Doe',
// };
// const objId = genId(person);
// log(objId.id.substring(0));

// 3.
// function genId<T>(obj: T & {id?: any}): T & {id: string} {
//   obj.id = 'truly-random';
//   return obj as T & {id: string};
// }
// // OR:
// // function genId<T>(obj: T): T & {id: string} {
// //   // Yes! that's fine.
// //   (obj as any).id = 'truly-random';
// //   return obj as T & {id: string};
// // }
// // Unfortunately, person2 has issues when id already exists of a different type!

// const person = {
//   name: 'Jane Doe',
// };
// const objId = genId(person);
// log(objId.id.substring(0));

// const person2 = {
//   name: 'Jane Doe',
//   id: 2,
// };
// const objId2 = genId(person2);
// log(objId2.id.substring(0));

// 4.
// Works!
function genId<T>(obj: T): Omit<T, 'id'> & {id: string} {
  (obj as any).id = 'truly-random';
  return obj as T & {id: string};
}

const person = {
  name: 'Jane Doe',
};
const objId = genId(person);
log(objId.id.substring(0));

const person2 = {
  name: 'Jane Doe',
  id: 2,
};
const objId2 = genId(person2);
log(objId2.id.substring(0));
